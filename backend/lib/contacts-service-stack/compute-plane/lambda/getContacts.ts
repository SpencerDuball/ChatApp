import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { getUserSub } from "./lambdaHelpers";

export const handler = async (event: any) => {
  const userSub = getUserSub(event);
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new QueryCommand({
    TableName: process.env.DDB_TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `USER#${userSub}` },
      ":sk": { S: `CONTACT#` },
    },
  });

  try {
    const res = await client.send(command);
    console.log(res);
    return {
      status: 200,
      body: res.Items
        ? res.Items.map((value) => ({
            id: value.SK?.S?.split("#").pop(),
            familyName: value.familyName?.S,
            givenName: value.givenName?.S,
            profilePhotoUrl: value.profilePhotoUrl?.S,
            notes: value.notes?.S,
          }))
        : [],
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
