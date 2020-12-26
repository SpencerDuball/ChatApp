import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
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

(async () => {
  console.log(
    await postContact({
      contactSub: "d1653350-03bd-4cb9-b256-afe4f250d4a1",
      givenName: "Luke",
      familyName: "Duball",
      profilePhotoUrl:
        "https://media-exp1.licdn.com/dms/image/C4D03AQHB4jlEPTjqNw/profile-displayphoto-shrink_200_200/0/1572031979719?e=1614211200&v=beta&t=4iw19D1asw0ex-bReBNK-xY631kNyFReCoQZciseU_k",
    })
  );
})();
