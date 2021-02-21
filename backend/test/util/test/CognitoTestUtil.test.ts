import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoTestUtil } from "../../../util/test/CognitoTestUtil";
import { getEnvVariables } from "../../../util/test/getEnvVariables";
import * as dotenv from "dotenv";

// configure environment variables
dotenv.config();
const requiredEnvVariables = [
  "IDENTITY_POOL_ID",
  "REGION",
  "USER_POOL_CLIENT_ID",
  "USER_POOL_ID",
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

describe("doesUserExist(): ", () => {
  test("returns false when user does not exist", async () => {
    await expect(
      cognito.doesUserExist("non-existant-user@fake.com")
    ).resolves.toBeFalsy();
  });

  test("throws error when CognitoTestUtil is configured incorrectly", async () => {
    const invalidCognito = new CognitoTestUtil({
      region: envVariables.REGION,
      userPoolId: "invalid_user_pool_id",
      userPoolClientId: envVariables.USER_POOL_CLIENT_ID,
      identityPoolId: envVariables.IDENTITY_POOL_ID,
    });

    await expect(
      invalidCognito.doesUserExist("non-existant-user@fake.com")
    ).rejects.toThrow(Error);
  });

  test("returns true when user does exist", async () => {
    const idpClient = new CognitoIdentityProviderClient({
      region: envVariables.REGION,
    });
    const testUser = {
      username: "bbork",
      email: "ben-bork@test.com",
      password: "password",
    };

    try {
      // ensure the user exists by trying to create the user. An error will throw if the user
      // already exists.
      await idpClient.send(
        new AdminCreateUserCommand({
          UserPoolId: envVariables.USER_POOL_ID,
          Username: testUser.username,
          UserAttributes: [
            { Name: "email", Value: testUser.email },
            { Name: "email_verified", Value: "True" },
          ],
          MessageAction: "SUPPRESS",
        })
      );
    } catch (error) {
      // if error thrown, make sure it is "UserExistsException", else throw again
      // this prevents errors such as "ResourceNotFoundException", "NotAuthorizedException", etc
      // from being interpreted as trying to create an existing user
      if (error.name !== "UserExistsException") throw error;
    }

    await expect(
      cognito.doesUserExist(testUser.username)
    ).resolves.toBeTruthy();
  });
});
