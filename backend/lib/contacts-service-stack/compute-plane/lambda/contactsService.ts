import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

// helpers
const parseCognitoSub = (amr: string[]) => {
  const [cognitoString] = amr.filter((value) =>
    value.includes("CognitoSignIn")
  );
  return cognitoString.split(":").pop();
};

// contact
export const getContact = async (event: any) => {
  const sub = parseCognitoSub(
    event.requestContext.authorizer.iam.cognitoIdentity.amr
  );

  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new GetItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: { S: `USER#${sub}` },
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
            sub: res.Item.SK.S?.split("#").pop(),
            givenName: res.Item.givenName.S,
            familyName: res.Item.familyName.S,
            profilePhotoUrl: res.Item.profilePhotoUrl.S,
            notes: res.Item.notes.S,
          },
        },
      };
    } else {
      return {
        status: 400,
        data: {
          code: "ItemNotFound",
          message: "No item exists with id: " + event.pathParameters.id,
        },
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: {
        code: "Unidentified",
        message: "The server threw an unidentified error.",
      },
    };
  }
};
export const postContact = async (event: any) => {
  const sub = parseCognitoSub(
    event.requestContext.authorizer.iam.cognitoIdentity.amr
  );
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new PutItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    Expected: { SK: { Exists: false } },
    Item: {
      PK: { S: `USER#${sub}` },
      SK: { S: `CONTACT#${event.body.sub}` },
      givenName: { S: event.body.givenName },
      familyName: { S: event.body.familyName },
      profilePhotoUrl: {
        S: event.body.profilePhotoUrl ? event.body.profilePhotoUrl : "",
      },
      notes: { S: event.body.notes ? event.body.notes : "" },
    },
    ReturnValues: "ALL_NEW",
  });

  try {
    const res = await client.send(command);
    return {
      status: 200,
      data: {
        item: {
          sub: res.Attributes?.SK.S?.split("#").pop(),
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
      status: 500,
      body: {
        code: "Unidentified",
        message: "The server threw an unidentified error.",
      },
    };
  }
};
export const patchContact = async (event: any) => {
  const sub = parseCognitoSub(
    event.requestContext.authorizer.iam.cognitoIdentity.amr
  );
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new UpdateItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    ExpressionAttributeNames: {
      "#GN": "givenName",
      "#FN": "familyName",
      "#P": "profilePhotoUrl",
      "#N": "notes",
    },
    ExpressionAttributeValues: {
      ":gn": event.body.givenName,
      ":fn": event.body.familyName,
      ":p": event.body.profilePhotoUrl,
      ":n": event.body.notes,
    },
    Key: {
      PK: { S: `USER#${sub}` },
      SK: { S: `CONTACT#${event.body.sub}` },
    },
    ReturnValues: "ALL_NEW",
    UpdateExpression: "SET #GN = :gn, #FN = :fn, #P = :p, #N = :n",
  });

  try {
  } catch (error) {}
};
export const deleteContact = async (event: any) => {
  const sub = parseCognitoSub(
    event.requestContext.authorizer.iam.cognitoIdentity.amr
  );
  const client = new DynamoDBClient({ region: process.env.REGION });
  const command = new DeleteItemCommand({
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
      PK: { S: `USER#${sub}` },
      SK: { S: `CONTACT#${event.pathParameters.id}` },
    },
  });
};

// contacts
export const getContacts = async (event: any) => {
  console.log(event);

  return {
    status: 200,
    body: [
      {
        given_name: "Jerry",
        family_name: "Macguire",
        email: "jerrymacguire@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
      {
        given_name: "Portia",
        family_name: "Doubleday",
        email: "portiadoubleday@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
      {
        given_name: "Rami",
        family_name: "Malek",
        email: "ramimalek@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
    ],
  };
};
