import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getUserSub } from "./lambdaHelpers";

export const handler = async (event: any) => {
  const userSub = getUserSub(event);
  const { sub, givenName, familyName, profilePhotoUrl, notes } = JSON.parse(
    event.body
  );
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new PutItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    ConditionExpression: "attribute_not_exists(#sk)",
    Item: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${sub}` },
      givenName: { S: givenName },
      familyName: { S: familyName },
      profilePhotoUrl: { S: profilePhotoUrl ? profilePhotoUrl : "" },
      notes: { S: notes ? notes : "" },
    },
    ExpressionAttributeNames: {
      "#sk": "SK",
    },
  });

  try {
    const res = await client.send(command);
    console.log(res);
    return { status: 200 };
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

// TOOD: need to check for uniqueness on the SK
