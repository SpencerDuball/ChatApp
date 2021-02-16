import * as dotenv from "dotenv";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createEnvFile } from "util/createEnvFile";

// configure environment variables
dotenv.config();

beforeAll(async () => {
  const requiredEnvVariables = ["USER_POOL_ID", "USERNAME"];

  // check if environment variables exist
  const isEnvUndefined = requiredEnvVariables
    .map((value) => process.env[value])
    .some((value) => value === undefined);

  // if environment variables don't exist, generate a new .env file
  if (isEnvUndefined) {
    await createEnvFile();
  }
});

test("create new user", async () => {
  // make sure test user doesn't exist
  const idpClient = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  });
  try {
    const user = await idpClient.send(
      new AdminGetUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: process.env.USERNAME,
      })
    );
  } catch (error) {
    console.log("User does exist.");
  }
});
