import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { getUserSub } from "./lambdaHelpers";

export const handler = async (event: any) => {
  const userSub = getUserSub(event);
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new DeleteItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${event.pathParameters.id}` },
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
