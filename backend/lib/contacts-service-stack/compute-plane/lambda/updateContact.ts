import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { getUserSub, getIdFromSk } from "./lambdaHelpers";

export const handler = async (event: any) => {
  // get event info
  const userSub = getUserSub(event);
  const { givenName, familyName, profilePhotoUrl, notes } = JSON.parse(
    event.body
  );

  // build command
  const expressionAttributeNames: { [key: string]: string } = { "#sk": "SK" };
  const expressionAttributeValues: { [key: string]: any } = {};
  const updateExpressionTerms = [];
  if (givenName) {
    updateExpressionTerms.push("#gn = :gn");
    expressionAttributeNames["#gn"] = "givenName";
    expressionAttributeValues[":gn"] = { S: givenName };
  }
  if (familyName) {
    updateExpressionTerms.push("#fn = :fn");
    expressionAttributeNames["#fn"] = "familyName";
    expressionAttributeValues[":fn"] = { S: familyName };
  }
  if (profilePhotoUrl) {
    updateExpressionTerms.push("#ppu = :ppu");
    expressionAttributeNames["#ppu"] = "profilePhotoUrl";
    expressionAttributeValues[":ppu"] = { S: profilePhotoUrl };
  }
  if (notes) {
    updateExpressionTerms.push("#n = :n");
    expressionAttributeNames["#n"] = "notes";
    expressionAttributeValues[":n"] = { S: notes };
  }

  let updateExpression = "";
  if (updateExpressionTerms.length > 0) {
    updateExpression =
      "SET " +
      updateExpressionTerms.reduce(
        (accumulator, newValue) => accumulator + ", " + newValue
      );
  }

  // ddb
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new UpdateItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    ReturnValues: "ALL_NEW",
    Key: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${event.pathParameters.id}` },
    },
    ConditionExpression: "attribute_exists(#sk)",
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  try {
    const res = await client.send(command);
    console.log(res);
    return {
      status: 200,
      data: {
        item: {
          id: res.Attributes?.SK.S?.split("#").pop(),
          givenName: res.Attributes?.givenName.S,
          familyName: res.Attributes?.familyName.S,
          profilePhotoUrl: res.Attributes?.profilePhotoUrl.S,
          notes: res.Attributes?.notes.S,
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
