import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const getTempCredentials = (kwargs: {
  region: string;
  userPoolClientId: string;
  userPoolId: string;
  identityPoolId: string;
}) => async (username: string, password: string) => {
  // create clients
  const idpClient = new CognitoIdentityProviderClient({
    region: kwargs.region,
  });
  const identityClient = new CognitoIdentityClient({ region: kwargs.region });

  // initiate auth
  const initiateAuthResponse = await idpClient.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: { USERNAME: username, PASSWORD: password },
      ClientId: kwargs.userPoolClientId,
    })
  );

  // get user ID from identity pool
  const CognitoUserPoolLoginsKey = `cognito-idp.${kwargs.region}.amazonaws.com/${kwargs.userPoolId}`;
  const getIdResponse = await identityClient.send(
    new GetIdCommand({
      IdentityPoolId: kwargs.identityPoolId,
      Logins: {
        [CognitoUserPoolLoginsKey]: initiateAuthResponse.AuthenticationResult!
          .IdToken!,
      },
    })
  );

  return await identityClient.send(
    new GetCredentialsForIdentityCommand({
      IdentityId: getIdResponse.IdentityId!,
      Logins: {
        [CognitoUserPoolLoginsKey]: initiateAuthResponse.AuthenticationResult!
          .IdToken!,
      },
    })
  );
};
