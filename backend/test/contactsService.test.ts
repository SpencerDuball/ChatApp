import * as dotenv from "dotenv";
import axios from "axios";
import { getTempCredentials } from "../util/getTempCredentials";
import { aws4Interceptor } from "aws4-axios";

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

  // setup aws4 interceptor
  const API = axios.create({
    baseURL: "https://9lmy17l4sa.execute-api.us-east-1.amazonaws.com",
  });
  API.interceptors.request.use(
    aws4Interceptor(
      {},
      {
        accessKeyId: Credentials!.AccessKeyId!,
        secretAccessKey: Credentials!.SecretKey!,
        sessionToken: Credentials!.SessionToken!,
      }
    )
  );

  try {
    // create new request
    const res = await API.get(
      "/test/contact/d1653350-03bd-4cb9-b256-afe4f250d4a2"
    );
    console.log("Success");
    console.log(res.data);
  } catch (error) {
    console.log("Error");
    console.log(error.data);
  }
})();
