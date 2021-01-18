import * as dotenv from "dotenv";
import { getTempCredentials } from "../util/getTempCredentials";
import * as WebSocket from "ws";
import { Signer } from "aws-amplify";

// configure environment variables
dotenv.config();

(async () => {
  // get credentials
  const { Credentials } = await getTempCredentials({
    region: process.env.TEST_REGION!,
    userPoolId: process.env.TEST_USER_POOL_ID!,
    userPoolClientId: process.env.TEST_USER_POOL_CLIENT_ID!,
    identityPoolId: process.env.TEST_IDENTITY_POOL_ID!,
  })(
    process.env.TEST_CREDENTIAL_USERNAME!,
    process.env.TEST_CREDENTIAL_PASSWORD!
  );

  try {
    const signedUrl = Signer.signUrl(
      "wss://qlln8gqu1e.execute-api.us-east-1.amazonaws.com/test",
      {
        access_key: Credentials!.AccessKeyId,
        secret_key: Credentials!.SecretKey,
        session_token: Credentials!.SessionToken,
      }
    );

    // create connection
    const ws = new WebSocket(signedUrl);

    ws.onopen = (e) => {
      console.log("Connection has opened ...");
      ws.send(JSON.stringify({ action: "createMessage" }));
    };
    ws.onclose = (e) => {
      console.log("Connection has closed ...");
    };
    ws.onmessage = (e) => {
      console.log("New message ...", e.data);
    };
  } catch (error) {
    console.log(error);
  }
})();
