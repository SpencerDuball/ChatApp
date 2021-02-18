import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoTestUtil } from "../../../util/test/CognitoTestUtil";
import { getEnvVariables } from "../../../util/test/getEnvVariables";
import * as dotenv from "dotenv";

// configure environment variables
dotenv.config();
const requiredEnvVariables = [
  "IDENTITY_POOL_ID",
  "PASSWORD",
  "REGION",
  "USER_POOL_CLIENT_ID",
  "USER_POOL_ID",
  "USERNAME",
];
const envVariables = getEnvVariables(requiredEnvVariables) as {
  IDENTITY_POOL_ID: string;
  PASSWORD: string;
  REGION: string;
  USER_POOL_CLIENT_ID: string;
  USER_POOL_ID: string;
  USERNAME: string;
};

// configure testing utils
const cognito = new CognitoTestUtil({
  region: envVariables.REGION,
  userPoolId: envVariables.USER_POOL_ID,
  userPoolClientId: envVariables.USER_POOL_CLIENT_ID,
  identityPoolId: envVariables.IDENTITY_POOL_ID,
});

test("doesUserExist returns false when user does not exist", async () => {
  // make sure user doesn't exist
  const idpClient = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  });
  try {
    // check if user exists (will throw error if doesn't)
    await idpClient.send(
      new AdminGetUserCommand({
        UserPoolId: envVariables.USER_POOL_ID,
        Username: envVariables.USERNAME,
      })
    );

    // if user exists, delete user and proceed
    await idpClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: envVariables.USER_POOL_ID,
        Username: envVariables.USERNAME,
      })
    );
  } catch (error) {} // do nothing, user doesn't exist already

  await expect(cognito.doesUserExist(envVariables.USERNAME)).resolves.toEqual(
    false
  );
});
