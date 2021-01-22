import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as apiGwV2 from "@aws-cdk/aws-apigatewayv2";
import * as ssm from "@aws-cdk/aws-ssm";

export class AuthStack extends cdk.Stack {
  private userPool: cognito.CfnUserPool;
  private userPoolClient: cognito.CfnUserPoolClient;
  private identityPool: cognito.CfnIdentityPool;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & {
      contactsApi: apiGwV2.CfnApi;
      wsApi: apiGwV2.CfnApi;
    }
  ) {
    super(scope, id, props);

    this.userPool = new cognito.CfnUserPool(this, "ChatAppUserPool", {
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

    this.userPoolClient = new cognito.CfnUserPoolClient(
      this,
      "ChatAppUserPoolClient",
      {
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
        userPoolId: this.userPool.ref,
      }
    );

    this.identityPool = new cognito.CfnIdentityPool(
      this,
      "ChatAppIdentityPool",
      {
        allowClassicFlow: false,
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.ref,
            providerName: this.userPool.attrProviderName,
            serverSideTokenCheck: true,
          },
        ],
      }
    );

    const authenticatedRole = new iam.CfnRole(this, "ChatAppDefaultAuthRole", {
      assumeRolePolicyDocument: iam.PolicyDocument.fromJson({
        Statement: [
          {
            Effect: "Allow",
            Principal: { Federated: "cognito-identity.amazonaws.com" },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
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
                  // httpapi
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.contactsApi.ref}/*/*/contact`,
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.contactsApi.ref}/*/*/contact/*`,
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.contactsApi.ref}/*/*/contacts`,
                  // ws api
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.wsApi.ref}/*`,
                ],
              },
            ],
          }),
          policyName: "ChatAppContactsApiInvokePolicy",
        },
      ],
    });

    const identityPoolAuthRoleAttachment = new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolAuthRoleAttachment",
      {
        identityPoolId: this.identityPool.ref,
        roleMappings: {
          ChatAppTesterShizip: {
            ambiguousRoleResolution: "AuthenticatedRole",
            identityProvider: `cognito-idp.${this.region}.amazonaws.com/${this.userPool.ref}:${this.userPoolClient.ref}`,
            type: "Token",
          },
        },
        roles: {
          authenticated: authenticatedRole.attrArn,
        },
      }
    );

    // create parameters
    new ssm.CfnParameter(this, "ChatAppSSM-Test-Region", {
      description: "The aws region.",
      name: "/ChatApp/test/region",
      type: "String",
      value: this.region,
    });
    new ssm.CfnParameter(this, "ChatAppSSM-Test-UserPoolClientId", {
      description: "The UserPoolClientId from the Cognito user pool.",
      name: "/ChatApp/test/user_pool_client_id",
      type: "String",
      value: this.userPoolClient.ref,
    });
    new ssm.CfnParameter(this, "ChatAppSSM-Test-UserPoolId", {
      description: "The UserPoolId from the Cognito user pool.",
      name: "/ChatApp/test/user_pool_id",
      type: "String",
      value: this.userPool.ref,
    });
    new ssm.CfnParameter(this, "ChatAppSSM-Test-IdentityPoolId", {
      description: "The IdentityPoolId from the Cognito user pool",
      name: "/ChatApp/test/identity_pool_id",
      type: "String",
      value: this.identityPool.ref,
    });
    const USERNAME = "spencerduball@gmail.com";
    const PASSWORD = "password";
    new ssm.CfnParameter(this, "ChatAppSSM-Test-TestCognitoUsername", {
      description: "The username of the test cognito user.",
      name: "/ChatApp/test/username",
      type: "String",
      value: USERNAME,
    });
    new ssm.CfnParameter(this, "ChatAppSSM-Test-TestCognitoPassword", {
      description: "The password of the test cognito user.",
      name: "/ChatApp/test/password",
      type: "String",
      value: PASSWORD,
    });
  }
}
