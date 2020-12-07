import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import axios from "axios";
import * as aws4 from "aws4";
import * as dotenv from "dotenv";

// configure environment variables
dotenv.config();

const getContact = async (credentials: {
  username: string;
  password: string;
}) => {
  // idp
  const cognitoIdpClient = new CognitoIdentityProviderClient({
    region: process.env.TEST_REGION,
  });
  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: credentials.username,
      PASSWORD: credentials.password,
    },
    ClientId: process.env.TEST_USER_POOL_CLIENT_ID,
  });

  // identity
  const cognitoIdentityClient = new CognitoIdentityClient({
    region: process.env.TEST_REGION,
  });

  try {
    const initiateAuthResponse = await cognitoIdpClient.send(
      initiateAuthCommand
    );
    const getId = await cognitoIdentityClient.send(
      new GetIdCommand({
        IdentityPoolId: process.env.TEST_IDENTITY_POOL_ID,
        Logins: {
          [`cognito-idp.${process.env.TEST_REGION}.amazonaws.com/${process.env.TEST_USER_POOL_ID}`]: initiateAuthResponse.AuthenticationResult!
            .IdToken!,
        },
      })
    );
    const getCredentialsForIdentityResponse = await cognitoIdentityClient.send(
      new GetCredentialsForIdentityCommand({
        IdentityId: getId.IdentityId!,
        Logins: {
          [`cognito-idp.${process.env.TEST_REGION}.amazonaws.com/${process.env.TEST_USER_POOL_ID}`]: initiateAuthResponse.AuthenticationResult!
            .IdToken!,
        },
      })
    );
    const host = "lod77fuppl.execute-api.us-east-1.amazonaws.com";
    const path = "/test/contact/3";
    const signature = aws4.sign(
      { host, path },
      {
        secretAccessKey:
          getCredentialsForIdentityResponse.Credentials?.SecretKey,
        accessKeyId: getCredentialsForIdentityResponse.Credentials?.AccessKeyId,
        sessionToken:
          getCredentialsForIdentityResponse.Credentials?.SessionToken,
      }
    );
    const res = await axios.get(`https://${host}${path}`, {
      headers: signature.headers,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

getContact({
  username: process.env.TEST_CREDENTIAL_USERNAME!,
  password: process.env.TEST_CREDENTIAL_PASSWORD!,
});
