import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as apiGwV2 from "@aws-cdk/aws-apigatewayv2";

export class AuthStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & { contactsApi: apiGwV2.CfnApi }
  ) {
    super(scope, id, props);

    const userPool = new cognito.CfnUserPool(this, "ChatAppUserPool", {
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

    const userPoolClient = new cognito.CfnUserPoolClient(
      this,
      "ChatAppUserPoolClient",
      {
        accessTokenValidity: 1, // in hours
        explicitAuthFlows: [
          "ALLOW_USER_SRP_AUTH",
          "ALLOW_REFRESH_TOKEN_AUTH",
          "ALLOW_CUSTOM_AUTH",
        ],
        generateSecret: false,
        idTokenValidity: 1, // in hours
        preventUserExistenceErrors: "ENABLED",
        refreshTokenValidity: 30, // in days
        supportedIdentityProviders: ["COGNITO"],
        userPoolId: userPool.ref,
      }
    );

    const identityPool = new cognito.CfnIdentityPool(
      this,
      "ChatAppIdentityPool",
      {
        allowClassicFlow: false,
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: userPoolClient.ref,
            providerName: userPool.attrProviderName,
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
                "cognito-identity.amazonaws.com:aud": identityPool.ref,
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
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.contactsApi.ref}/*/*/contact`,
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.contactsApi.ref}/*/*/contact/*`,
                  `arn:aws:execute-api:${this.region}:${this.account}:${props.contactsApi.ref}/*/*/contacts`,
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
        identityPoolId: identityPool.ref,
        roleMappings: {
          ChatAppTesterShizip: {
            ambiguousRoleResolution: "AuthenticatedRole",
            identityProvider: `cognito-idp.${this.region}.amazonaws.com/${userPool.ref}:${userPoolClient.ref}`,
            type: "Token",
          },
        },
        roles: {
          authenticated: authenticatedRole.attrArn,
        },
      }
    );
  }
}
