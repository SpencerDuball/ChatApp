import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface CognitoTestUtilPropsI {
  region: string;
  identityPoolId: string;
  userPoolId: string;
  userPoolClientId: string;
}

export class CognitoTestUtil {
  private region: string;
  private identityPoolId: string;
  private userPoolId: string;
  private userPoolClientId: string;

  constructor(props: CognitoTestUtilPropsI) {
    this.region = props.region;
    this.identityPoolId = props.identityPoolId;
    this.userPoolId = props.userPoolId;
    this.userPoolClientId = props.userPoolClientId;
  }

  /**
   * Check for the existance of a user in the cognito user pool.
   *
   * @param username The username to check for existance.
   */
  async doesUserExist(username: string) {
    // create an idpClient
    const idpClient = new CognitoIdentityProviderClient({
      region: this.region,
    });

    try {
      const user = await idpClient.send(
        new AdminGetUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
