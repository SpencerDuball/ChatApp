import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
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
      // get the user, throws if no user
      await idpClient.send(
        new AdminGetUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        })
      );

      // user does exist, return true
      return true;
    } catch (error) {
      // if error thrown, make sure it is "UserNotFoundException", else throw again
      // this prevents errors such as "ResourceNotFoundException", "NotAuthorizedException", etc
      // from being interpreted as a missing user instead of an invalid request
      if (error.name === "UserNotFoundException") {
        // user does not exist, return false
        return false;
      } else throw error;
    }
  }
}
