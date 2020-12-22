import * as dotenv from "dotenv";
import { signedRequest } from "./signedRequest";

// configure environment variables
dotenv.config();

const host = "lod77fuppl.execute-api.us-east-1.amazonaws.com";
const path = "/test/contact/3";

(async () => {
  try {
    const res = await signedRequest(
      process.env.TEST_CREDENTIAL_USERNAME!,
      process.env.TEST_CREDENTIAL_PASSWORD!
    )({
      method: "GET",
      host,
      path,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
})();
