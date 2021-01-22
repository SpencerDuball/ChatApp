import * as dotenv from "dotenv";
import { getTempCredentials } from "../util/getTempCredentials";
import * as WebSocket from "ws";
import * as aws4 from "aws4";
import { URL } from "url";

// configure environment variables
dotenv.config();

(async () => {
  // get credentials
  const { Credentials } = await getTempCredentials({
    region: process.env.REGION!,
    userPoolId: process.env.USER_POOL_ID!,
    userPoolClientId: process.env.USER_POOL_CLIENT_ID!,
    identityPoolId: process.env.IDENTITY_POOL_ID!,
  })(process.env.USERNAME!, process.env.PASSWORD!);

  try {
    const url = new URL(process.env.WS_API_URL);
    const signedRequest = aws4.sign(
      {
        host: url.host,
        path: url.pathname + url.search,
        signQuery: true,
      },
      {
        accessKeyId: Credentials!.AccessKeyId,
        secretAccessKey: Credentials!.SecretKey,
        sessionToken: Credentials!.SessionToken,
      }
    );

    // create connection
    const ws = new WebSocket(
      `${url.protocol}//${signedRequest.host}${signedRequest.path}`
    );

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
