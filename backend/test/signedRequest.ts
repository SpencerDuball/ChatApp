import * as dotenv from "dotenv";
import * as aws4 from "aws4";
import axios, { Method } from "axios";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface IAWSV4Params {
  host: string;
  path: string;
}
interface IAxiosParams {
  method: Method;
  headers?: { [key: string]: string };
  body?: string;
}

// configure environment variables
dotenv.config();

export const signedRequest = (username: string, password: string) => async (
  options: IAxiosParams & IAWSV4Params
) => {
  // create clients
  const cognitoIdpClient = new CognitoIdentityProviderClient({
    region: process.env.TEST_REGION,
  });
  const cognitoIdentityClient = new CognitoIdentityClient({
    region: process.env.TEST_REGION,
  });

  const initiateAuthResponse = await cognitoIdpClient.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: process.env.TEST_USER_POOL_CLIENT_ID,
    })
  );

  const CognitoUserPoolLoginsKey = `cognito-idp.${process.env.TEST_REGION}.amazonaws.com/${process.env.TEST_USER_POOL_ID}`;
  const getIdResponse = await cognitoIdentityClient.send(
    new GetIdCommand({
      IdentityPoolId: process.env.TEST_IDENTITY_POOL_ID,
      Logins: {
        [CognitoUserPoolLoginsKey]: initiateAuthResponse.AuthenticationResult!
          .IdToken!,
      },
    })
  );

  const getCredentialsForIdentityResponse = await cognitoIdentityClient.send(
    new GetCredentialsForIdentityCommand({
      IdentityId: getIdResponse.IdentityId!,
      Logins: {
        [CognitoUserPoolLoginsKey]: initiateAuthResponse.AuthenticationResult!
          .IdToken!,
      },
    })
  );

  // create axios request
  let opts: { [key: string]: any } = {
    host: options.host,
    path: options.path,
    headers: {
      ...options.headers,
    },
    body: options.body || "",
  };

  // create signature
  const signature = aws4.sign(opts, {
    secretAccessKey: getCredentialsForIdentityResponse.Credentials?.SecretKey,
    accessKeyId: getCredentialsForIdentityResponse.Credentials?.AccessKeyId,
    sessionToken: getCredentialsForIdentityResponse.Credentials?.SessionToken,
  });
  console.log(signature);
  console.log(options.host);

  return axios({
    method: options.method,
    url: `https://${options.host}${options.path}`,
    headers: signature.headers,
  });
};
