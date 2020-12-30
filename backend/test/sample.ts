import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

const userSub = "d1653350-03bd-4cb9-b256-afe4f250d4d2";
const REGION = "us-east-1";
const DDB_TABLE_NAME = "ChatAppDDBTable";

const getContact = async (contactSub: string) => {
  const client = new DynamoDBClient({ region: REGION });
  const command = new GetItemCommand({
    TableName: DDB_TABLE_NAME,
    Key: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${contactSub}` },
    },
  });

  try {
    const res = await client.send(command);
    return res;
  } catch (error) {
    console.log("THIS IS AN ERROR");
    return error;
  }
};

const postContact = async (props: {
  contactSub: string;
  givenName: string;
  familyName: string;
  profilePhotoUrl?: string;
  notes?: string;
}) => {
  const client = new DynamoDBClient({ region: REGION });
  const command = new PutItemCommand({
    TableName: DDB_TABLE_NAME,
    Expected: { SK: { Exists: true } },
    Item: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${props.contactSub}` },
      givenName: { S: props.givenName },
      familyName: { S: props.familyName },
      profilePhotoUrl: {
        S: props.profilePhotoUrl ? props.profilePhotoUrl : "",
      },
      notes: { S: props.notes ? props.notes : "" },
    },
  });

  try {
    const res = await client.send(command);
    return res;
  } catch (error) {
    return error;
  }
};

const deleteContact = async (contactSub: string) => {
  const client = new DynamoDBClient({ region: REGION });
  const command = new DeleteItemCommand({
    TableName: DDB_TABLE_NAME,
    Key: {
      PK: { S: `USER#${userSub}` },
      SK: { S: `CONTACT#${contactSub}` },
    },
  });

  try {
    const res = await client.send(command);
    return res;
  } catch (error) {
    return error;
  }
};

const getContacts = async (sub: string) => {
  const client = new DynamoDBClient({ region: REGION });
  const command = new QueryCommand({
    TableName: DDB_TABLE_NAME,
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `USER#${sub}` },
      ":sk": { S: `CONTACT#` },
    },
  });

  try {
    const res = await client.send(command);
    return res;
  } catch (error) {
    return error;
  }
};

(async () => {
  console.log(await getContacts("d1653350-03bd-4cb9-b256-afe4f250d4d2"));
})();
