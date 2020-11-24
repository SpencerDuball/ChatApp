import { useEffect, Dispatch } from "react";
import { IAuthContextAction } from "./AuthContext";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const useInitiateAuth = (dispatch: Dispatch<IAuthContextAction>) => {
  useEffect(() => {
    (async () => {
      const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
        region: "us-east-1",
      });
    })();
  }, []);
};

// const ChatAppWebClientUserPoolId = "";

// const res = await cognitoIdentityProviderClient.send(
//   new InitiateAuthCommand({
//     AuthFlow: AuthFlowType.USER_SRP_AUTH,
//     ClientId: ChatAppWebClientUserPoolId,
//     AuthParameters: {
//       USERNAME: "spencerduball@gmail.com",
//       SRP_A: "password",
//       SECRET_HASH: "",
//     },
//   })
// );
// console.log(res);
