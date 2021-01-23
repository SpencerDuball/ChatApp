import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";

interface AuthStackPropsI extends cdk.StackProps {}

/**
 * Creates a CfnUserPool construct.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resouce.
 */
const createUserPool = (scope: cdk.Stack, id: string) =>
  new cognito.CfnUserPool(scope, id, {
    accountRecoverySetting: {
      recoveryMechanisms: [{ name: "verified_email", priority: 1 }],
    },
    autoVerifiedAttributes: ["email"],
    emailConfiguration: {
      emailSendingAccount: "COGNITO_DEFAULT",
    },
    mfaConfiguration: "OFF",
    policies: {
      passwordPolicy: {
        minimumLength: 8,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        requireUppercase: false,
        temporaryPasswordValidityDays: 7,
      },
    },
    usernameAttributes: ["email"],
    usernameConfiguration: { caseSensitive: false },
    verificationMessageTemplate: {
      defaultEmailOption: "CONFIRM_WITH_CODE",
    },
  });

/**
 * Creates a CfnUserPoolClient construct configured for web.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resouce.
 * @param props - the UserPool that this UserPoolClient is attached to.
 */
const createWebClient = (
  scope: cdk.Stack,
  id: string,
  props: { userPool: cognito.CfnUserPool }
) =>
  new cognito.CfnUserPoolClient(scope, id, {
    accessTokenValidity: 1, // in hours
    explicitAuthFlows: [
      "ALLOW_USER_SRP_AUTH",
      "ALLOW_REFRESH_TOKEN_AUTH",
      "ALLOW_CUSTOM_AUTH",
      "ALLOW_USER_PASSWORD_AUTH",
    ],
    generateSecret: false,
    idTokenValidity: 1, // in hours
    preventUserExistenceErrors: "ENABLED",
    refreshTokenValidity: 30, // in days
    supportedIdentityProviders: ["COGNITO"],
    userPoolId: props.userPool.ref,
  });

/**
 * Creates a CfnIdentityPool construct.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resouce.
 * @param props - The properties used to create a CfnIdentityPool.
 */
const createIdentityPool = (
  scope: cdk.Stack,
  id: string,
  props: {
    userPool: cognito.CfnUserPool;
    userPoolClients: { web: cognito.CfnUserPoolClient };
  }
) =>
  new cognito.CfnIdentityPool(scope, id, {
    allowClassicFlow: false,
    allowUnauthenticatedIdentities: false,
    cognitoIdentityProviders: [
      {
        clientId: props.userPoolClients.web.ref,
        providerName: props.userPool.attrProviderName,
        serverSideTokenCheck: true,
      },
    ],
  });

/**
 * Create the IAM role for the authenticated users.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resource.
 * @param props - The properties used to create a CfnIdentityPool.
 */
const createAuthenticatedRoles = (
  scope: cdk.Stack,
  id: string,
  props: { identityPool: cognito.CfnIdentityPool }
) =>
  new iam.CfnRole(scope, id, {
    assumeRolePolicyDocument: iam.PolicyDocument.fromJson({
      Statement: [
        {
          Effect: "Allow",
          Principal: { Federated: "cognito-identity.amazonaws.com" },
          Action: "sts:AssumeRoleWithWebIdentity",
          Condition: {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": props.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
        },
      ],
    }),
    policies: [
      {
        policyDocument: iam.PolicyDocument.fromJson({
          Statement: [
            {
              Effect: "Allow",
              Action: ["execute-api:*"],
              Resource: [
                // http api
                `arn:aws:execute-api:${scope.region}:${scope.account}:*/*/*/contact`,
                `arn:aws:execute-api:${scope.region}:${scope.account}:*/*/*/contact/*`,
                `arn:aws:execute-api:${scope.region}:${scope.account}:*/*/*/contacts`,
                // ws api
                `arn:aws:execute-api:${scope.region}:${scope.account}:*/*`,
              ],
            },
          ],
        }),
        policyName: "ChatAppContactsApiInvokePolicy",
      },
    ],
  });

/**
 * Creates an IdentityPoolRoleAttachemnt.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resource.
 * @param props - The properties used to create a CfnIdentityPool.
 */
const createIdentityPoolRoleAttachment = (
  scope: cdk.Stack,
  id: string,
  props: {
    identityPool: cognito.CfnIdentityPool;
    userPool: cognito.CfnUserPool;
    webClient: cognito.CfnUserPoolClient;
    authenticatedRole: iam.CfnRole;
  }
) =>
  new cognito.CfnIdentityPoolRoleAttachment(scope, id, {
    identityPoolId: props.identityPool.ref,
    roleMappings: {
      ChatAppTesterShizip: {
        ambiguousRoleResolution: "AuthenticatedRole",
        identityProvider: `cognito-idp.${scope.region}.amazonaws.com/${props.userPool.ref}:${props.webClient.ref}`,
        type: "Token",
      },
    },
    roles: {
      authenticated: props.authenticatedRole.attrArn,
    },
  });

export class AuthStack extends cdk.Stack {
  private userPool: cognito.CfnUserPool;
  private userPoolClients: {
    web: cognito.CfnUserPoolClient;
  };
  private identityPool: cognito.CfnIdentityPool;
  private authenticatedRole: iam.CfnRole;
  private identityPoolRoleAttachment: cognito.CfnIdentityPoolRoleAttachment;

  constructor(scope: cdk.Construct, id: string, props: AuthStackPropsI) {
    super(scope, id, props);

    // create the UserPool
    this.userPool = createUserPool(this, "ChatAppUserPool");

    // create the UserPoolClients
    this.userPoolClients = {
      web: createWebClient(this, "ChatAppUserPoolClient-Web", {
        userPool: this.userPool,
      }),
    };

    // create the IdentityPool
    this.identityPool = createIdentityPool(this, "ChatAppIdentityPool", {
      userPool: this.userPool,
      userPoolClients: { web: this.userPoolClients.web },
    });

    // create the authenticated role for IdentityPool users
    this.authenticatedRole = createAuthenticatedRoles(
      this,
      "ChatAppAuthenticatedRole",
      {
        identityPool: this.identityPool,
      }
    );

    // create the IdentityPoolRoleAttachement
    this.identityPoolRoleAttachment = createIdentityPoolRoleAttachment(
      this,
      "ChatAppIdentityPoolRoleAttachement",
      {
        identityPool: this.identityPool,
        userPool: this.userPool,
        webClient: this.userPoolClients.web,
        authenticatedRole: this.authenticatedRole,
      }
    );
  }
}
