import * as cdk from "@aws-cdk/core";
import * as apiGwV2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as ssm from "@aws-cdk/aws-ssm";

interface ComputePlaneLambda {
  lambda: {
    [key: string]: lambda.CfnFunction;
  };
}

interface ApiPlaneProps extends cdk.StackProps, ComputePlaneLambda {}

const createInvokeLambdaRole = (apiPlane: ApiPlane, props: ApiPlaneProps) => {
  // create invoke policy
  const invokeLambdaPolicy = new iam.CfnManagedPolicy(
    apiPlane,
    "ChatAppInvokeLambdaPolicy",
    {
      policyDocument: iam.PolicyDocument.fromJson({
        Statement: [
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: Object.values(props.lambda).map(
              (lambdaValue) => lambdaValue.attrArn
            ),
          },
        ],
      }),
    }
  );

  // create invoke role
  const invokeLambdaRole = new iam.CfnRole(
    apiPlane,
    "ChatAppInvokeLambdaRoleForApiGwV2",
    {
      assumeRolePolicyDocument: iam.PolicyDocument.fromJson({
        Statement: [
          {
            Effect: "Allow",
            Principal: { Service: ["apigateway.amazonaws.com"] },
            Action: ["sts:AssumeRole"],
          },
        ],
      }),
      managedPolicyArns: [invokeLambdaPolicy.ref],
    }
  );

  return { invokeLambdaPolicy, invokeLambdaRole };
};

const createHttpApi = (apiPlane: ApiPlane, props: ApiPlaneProps) => {
  // create api
  apiPlane.httpApi = new apiGwV2.CfnApi(apiPlane, "ChatAppHttpApi", {
    body: {
      openapi: "3.0.1",
      info: {
        title: "ChatAppHttpApi",
        version: "1.0.0",
      },
      "x-amazon-apigateway-cors": {
        allowOrigins: ["*"],
        allowHeaders: ["*"],
        allowMethods: ["*"],
      },
      paths: {
        "/contact": {
          post: {
            responses: {
              default: {
                description: "Default response for POST /contact",
              },
            },
            "x-amazon-apigateway-auth": { type: "AWS_IAM" },
            "x-amazon-apigateway-integration": {
              payloadFormatVersion: "2.0",
              credentials: apiPlane.invokeLambdaRole.attrArn,
              type: "aws_proxy",
              httpMethod: "POST",
              uri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.postContact.attrArn}/invocations`,
              connectionType: "INTERNET",
            },
          },
        },
        "/contact/{id}": {
          get: {
            responses: {
              default: {
                description: "Default response for GET /contact/{id}",
              },
            },
            "x-amazon-apigateway-auth": { type: "AWS_IAM" },
            "x-amazon-apigateway-integration": {
              payloadFormatVersion: "2.0",
              credentials: apiPlane.invokeLambdaRole.attrArn,
              type: "aws_proxy",
              httpMethod: "POST",
              uri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.getContact.attrArn}/invocations`,
              connectionType: "INTERNET",
            },
          },
          patch: {
            responses: {
              default: {
                description: "Default response for PATCH /contact/{id}",
              },
            },
            "x-amazon-apigateway-auth": { type: "AWS_IAM" },
            "x-amazon-apigateway-integration": {
              payloadFormatVersion: "2.0",
              credentials: apiPlane.invokeLambdaRole.attrArn,
              type: "aws_proxy",
              httpMethod: "POST",
              uri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.patchContact.attrArn}/invocations`,
              connectionType: "INTERNET",
            },
          },
          delete: {
            responses: {
              default: {
                description: "Default response for DELETE /contact/{id}",
              },
            },
            "x-amazon-apigateway-auth": { type: "AWS_IAM" },
            "x-amazon-apigateway-integration": {
              payloadFormatVersion: "2.0",
              credentials: apiPlane.invokeLambdaRole.attrArn,
              type: "aws_proxy",
              httpMethod: "POST",
              uri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.deleteContact.attrArn}/invocations`,
              connectionType: "INTERNET",
            },
          },
        },
        "/contacts": {
          get: {
            responses: {
              default: {
                description: "Default response for GET /contacts",
              },
            },
            "x-amazon-apigateway-auth": { type: "AWS_IAM" },
            "x-amazon-apigateway-integration": {
              payloadFormatVersion: "2.0",
              credentials: apiPlane.invokeLambdaRole.attrArn,
              type: "aws_proxy",
              httpMethod: "POST",
              uri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.getContacts.attrArn}/invocations`,
              connectionType: "INTERNET",
            },
          },
        },
      },
      tags: [
        {
          name: "Project",
          "x-amazon-apigateway-tag-value": "ChatApp",
        },
      ],
    },
  });

  // create test stage
  new apiGwV2.CfnStage(apiPlane, "ChatAppHttpApiTestStage", {
    apiId: apiPlane.httpApi.ref,
    stageName: "test",
    autoDeploy: true,
  });
};

const createWsApi = (apiPlane: ApiPlane, props: ApiPlaneProps) => {
  // create wsApi
  apiPlane.wsApi = new apiGwV2.CfnApi(apiPlane, "ChatAppWsApi", {
    apiKeySelectionExpression: "$request.header.x-api-key", // may need to be "${request.header.x-api-key}"?
    name: "ChatAppWsApi",
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.action",
  });

  // create $connect route
  const connectIntegration = new apiGwV2.CfnIntegration(
    apiPlane,
    "ChatAppWsApiConnectIntegration",
    {
      apiId: apiPlane.wsApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.connect.attrArn}/invocations`,
      credentialsArn: apiPlane.invokeLambdaRole.attrArn,
    }
  );
  const connectRoute = new apiGwV2.CfnRoute(
    apiPlane,
    "ChatAppWsApiConnectRoute",
    {
      apiId: apiPlane.wsApi.ref,
      apiKeyRequired: false,
      authorizationType: "AWS_IAM",
      routeKey: "$connect",
      target: `integrations/${connectIntegration.ref}`,
    }
  );

  // create $disconnect route
  const disconnectIntegration = new apiGwV2.CfnIntegration(
    apiPlane,
    "ChatAppWsApiDisconnectIntegration",
    {
      apiId: apiPlane.wsApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.disconnect.attrArn}/invocations`,
      credentialsArn: apiPlane.invokeLambdaRole.attrArn,
    }
  );
  const disconnectRoute = new apiGwV2.CfnRoute(
    apiPlane,
    "ChatAppWsApiDisconnectRoute",
    {
      apiId: apiPlane.wsApi.ref,
      routeKey: "$disconnect",
      target: `integrations/${disconnectIntegration.ref}`,
    }
  );

  // create createMessage route
  const createMessageIntegration = new apiGwV2.CfnIntegration(
    apiPlane,
    "ChatAppWsApiCreateMessageIntegration",
    {
      apiId: apiPlane.wsApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: `arn:aws:apigateway:${apiPlane.region}:lambda:path/2015-03-31/functions/${props.lambda.createMessage.attrArn}/invocations`,
      credentialsArn: apiPlane.invokeLambdaRole.attrArn,
    }
  );
  const createMessage = new apiGwV2.CfnRoute(
    apiPlane,
    "ChatAppWsApiCreateMessageRoute",
    {
      apiId: apiPlane.wsApi.ref,
      routeKey: "createMessage",
      target: `integrations/${createMessageIntegration.ref}`,
    }
  );

  // create test stage
  new apiGwV2.CfnStage(apiPlane, "ChatAppWsApiTestStage", {
    apiId: apiPlane.wsApi.ref,
    stageName: "test",
    autoDeploy: true,
  });
};

export class ApiPlane extends cdk.Stack {
  public httpApi: apiGwV2.CfnApi;
  public wsApi: apiGwV2.CfnApi;
  public invokeLambdaRole: iam.CfnRole;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & ComputePlaneLambda
  ) {
    super(scope, id, props);

    // create role for ApiGateway to call lambda functions
    const { invokeLambdaRole } = createInvokeLambdaRole(this, props);
    this.invokeLambdaRole = invokeLambdaRole;

    createHttpApi(this, props);
    createWsApi(this, props);

    // add parameters
    new ssm.CfnParameter(this, "ChatAppSSM-Test-TestCognitoUsername", {
      description: "The HTTP API endpoint.",
      name: "/ChatApp/test/http_api_url",
      type: "String",
      value: `wss://${this.httpApi.ref}.execute-api.${this.region}.amazonaws.com/test`,
    });
    new ssm.CfnParameter(this, "ChatAppSSM-Test-TestCognitoPassword", {
      description: "The WS API endpoint.",
      name: "/ChatApp/test/ws_api_url",
      type: "String",
      value: `https://${this.wsApi.ref}.execute-api.${this.region}.amazonaws.com/test`,
    });
  }
}
