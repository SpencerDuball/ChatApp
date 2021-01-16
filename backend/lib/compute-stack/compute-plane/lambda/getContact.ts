import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { getUserSub } from "./lambdaHelpers";

export const handler = async (event: any) => {
  const userSub = getUserSub(event);
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new GetItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${event.pathParameters.id}` },
    },
  });

  try {
    const res = await client.send(command);
    console.log(res);

    if (res.Item) {
      return {
        status: 200,
        data: {
          item: {
            id: res.Item.SK.S?.split("#").pop(),
            givenName: res.Item.givenName.S,
            familyName: res.Item.familyName.S,
            profilePhotoUrl: res.Item.profilePhotoUrl.S,
            notes: res.Item.notes.S,
          },
        },
      };
    } else {
      return {
        status: 404,
        data: {
          code: "Not Found",
          message: `No item exists with id: ${event.pathParameters.id}`,
        },
      };
    }
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
