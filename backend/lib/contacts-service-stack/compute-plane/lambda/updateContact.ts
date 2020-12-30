import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { getUserSub } from "./lambdaHelpers";

export const handler = async (event: any) => {
  // get event info
  const userSub = getUserSub(event);
  const { givenName, familyName, profilePhotoUrl, notes } = event.body;

  // create UpdateExpression string
  const updateStrings = [];
  if (givenName) updateStrings.push("SET #gn :gn");
  if (familyName) updateStrings.push("SET #fn :fn");
  if (profilePhotoUrl) updateStrings.push("SET #ppu :ppu");
  if (notes) updateStrings.push("SET #n :n");

  // ddb
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new UpdateItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    Expected: { SK: { Exists: true } },
    ReturnValues: "ALL_NEW",
    Key: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${event.pathParameters.id}` },
    },
    UpdateExpression: updateStrings.reduce(
      (accumulator, newValue) => accumulator + ", " + newValue
    ),
    ExpressionAttributeNames: {
      "#gn": "givenName",
      "#fn": "familyName",
      "#ppu": "profilePhotoUrl",
      "#n": "notes",
    },
    ExpressionAttributeValues: {
      ":gn": { S: givenName },
      ":fn": { S: familyName },
      ":ppu": { S: profilePhotoUrl },
      ":n": { S: notes },
    },
  });

  try {
    const res = await client.send(command);
    console.log(res);
    return {
      status: 200,
      data: {
        item: {
          givenName: res.Attributes?.sub.S,
          familyName: res.Attributes?.sub.S,
          profilePhotoUrl: res.Attributes?.sub.S,
          notes: res.Attributes?.sub.S,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: error.$metadata.httpStatusCode,
      data: {
        code: error.name,
        message: error.message,
      },
    };
  }
};
