import * as cdk from "@aws-cdk/core";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as assets from "@aws-cdk/aws-s3-assets";
import * as path from "path";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { capitalize } from "../../util/stringUtil";

/**
 * Creates an HTTP API.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resource.
 * @param props - the properties of the resource.
 */
const createHttpApi = (scope: cdk.Stack, id: string) => {
  const httpApi = new apigatewayv2.CfnApi(scope, id, {
    corsConfiguration: {
      allowOrigins: ["*"],
      allowHeaders: ["*"],
      allowMethods: ["*"],
    },
    description: "The HTTP API for ChatApp.",
    name: "ChatAppHttpApi",
    protocolType: "HTTP",
  });

  const stage = process.env.ENV!;
  new apigatewayv2.CfnStage(scope, `ChatAppHttpApiStage-${stage}`, {
    apiId: httpApi.ref,
    stageName: stage,
    autoDeploy: true,
  });

  return httpApi;
};

/**
 * Creates a Websocket API.
 *
 * @param scope - scope in which this resource is defined.
 * @param id - scoped id of the resource.
 * @param props - the properties of the resource.
 */
const createWsApi = (scope: cdk.Stack, id: string) => {
  const wsApi = new apigatewayv2.CfnApi(scope, id, {
    apiKeySelectionExpression: "$request.header.x-api-key",
    description: "The Websocket API for ChatApp.",
    name: "ChatAppWsApi",
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.action",
  });

  const stage = process.env.ENV!;
  new apigatewayv2.CfnStage(scope, `ChatAppWsApiStage-${stage}`, {
    apiId: wsApi.ref,
    stageName: stage,
    autoDeploy: true,
  });

  return wsApi;
};

/**
 * Creates the readRole & writeRole for apigateway lambda integrations.
 *
 * @param scope - scope in which this resource is defined.
 * @param props - scoped id of the resource.
 */
const createLambdaRoles = (
  scope: cdk.Stack,
  props: { ddbTable: dynamodb.CfnTable; wsApi: apigatewayv2.CfnApi }
) => {
  // collect managed policies
  const AWSLambdaBasicExecutionRole =
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";

  // control who can assume these roles
  const assumeRolePolicyDocument = iam.PolicyDocument.fromJson({
    Statement: [
      {
        Effect: "Allow",
        Principal: { Service: ["lambda.amazonaws.com"] },
        Action: ["sts:AssumeRole"],
      },
    ],
  });

  // create dynamo shared policy objects
  const ddbReadActions = [
    "dynamodb:BatchGetItem",
    "dynamodb:ConditionCheckItem",
    "dynamodb:GetItem",
    "dynamodb:Query",
    "dynamodb:Scan",
  ];
  const ddbWriteActions = [
    "dynamodb:BatchWriteItem",
    "dynamodb:DeleteItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
  ];
  const ddbResources = [
    `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${props.ddbTable.ref}`,
    `arn:aws:dynamodb:${scope.region}:${scope.account}:table/${props.ddbTable.ref}/index`,
  ];
  const wsApiInvokeActions = [
    "execute-api:Invoke",
    "execute-api:ManageConnections",
  ];
  const wsApiResources = [
    `arn:aws:execute-api:${scope.region}:${scope.account}:*/*/*`,
  ];

  // create policies
  const readPolicy = {
    policyDocument: iam.PolicyDocument.fromJson({
      Statement: [
        {
          Effect: "Allow",
          Action: [...ddbReadActions],
          Resource: [...ddbResources],
        },
      ],
    }),
    policyName: "ChatAppDDBReadPolicy",
  };
  const writePolicy = {
    policyDocument: iam.PolicyDocument.fromJson({
      Statement: [
        {
          Effect: "Allow",
          Action: [...ddbReadActions, ...ddbWriteActions],
          Resource: [...ddbResources],
        },
        {
          Effect: "Allow",
          Action: [...wsApiInvokeActions],
          Resource: [...wsApiResources],
        },
      ],
    }),
    policyName: "ChatAppDDBWritePolicy",
  };

  // create roles
  const dynamodbReadRole = new iam.CfnRole(scope, "ChatAppDDBReadRole", {
    assumeRolePolicyDocument,
    managedPolicyArns: [AWSLambdaBasicExecutionRole],
    policies: [readPolicy],
  });
  const dynamodbWriteRole = new iam.CfnRole(scope, "ChatAppDDBWriteRole", {
    assumeRolePolicyDocument,
    managedPolicyArns: [AWSLambdaBasicExecutionRole],
    policies: [writePolicy],
  });

  return { dynamodbReadRole, dynamodbWriteRole };
};

/**
 * Create the lambda layer for ChatApp APIs.
 *
 * @param scope - scope in which this resource is defined.
 * @param props - scoped id of the resource.
 */
const createApiLambdaLayer = (
  scope: cdk.Stack,
  props: { layerS3Assets: assets.Asset }
) => {
  const computeServiceLambdaLayer = new lambda.CfnLayerVersion(
    scope,
    "ChatAppApiLambdaLayer",
    {
      compatibleRuntimes: ["nodejs12.x"],
      content: {
        s3Bucket: props.layerS3Assets.s3BucketName,
        s3Key: props.layerS3Assets.s3ObjectKey,
      },
      description: "ChatApp lambda layer.",
      layerName: "ComputeServiceLambdaLayer",
    }
  );
  new lambda.CfnLayerVersionPermission(scope, "ChatAppApiLambdaLayer", {
    action: "lambda:GetLayerVersion",
    layerVersionArn: computeServiceLambdaLayer.ref,
    principal: scope.account,
  });

  return computeServiceLambdaLayer;
};

/**
 * Creates a lambda factory function.
 *
 * @param scope - scope in which this resource is defined.
 * @param props - scoped id of the resource.
 */
const createLambdaFactory = (
  scope: cdk.Stack,
  props: {
    assetsZip: assets.Asset;
    ddbTable: dynamodb.CfnTable;
    layers: lambda.CfnLayerVersion[];
  }
) => (handler: string, role: iam.CfnRole) => {
  // construct construct id
  // handler should have name = myFunction.handler
  const id =
    "ChatApp" +
    handler
      .split(".") // split into components ["myFunction", "handler"]
      .shift()! // return "myFunction"
      .replace(/\w/, (word) => word.toUpperCase()) + // capitalize "MyFunction"
    "Lambda";

  return new lambda.CfnFunction(scope, id, {
    code: {
      s3Bucket: props.assetsZip.s3BucketName,
      s3Key: props.assetsZip.s3ObjectKey,
    },
    environment: {
      variables: {
        DDB_TABLE_NAME: props.ddbTable.tableName!,
        REGION: scope.region,
      },
    },
    layers: props.layers.map((layer) => layer.ref),
    handler,
    runtime: "nodejs12.x",
    role: role.attrArn,
    functionName: id,
  });
};

interface ApiStackPropsI extends cdk.StackProps {}

export class ApiStack extends cdk.Stack {
  private httpApi: apigatewayv2.CfnApi;
  private wsApi: apigatewayv2.CfnApi;

  constructor(scope: cdk.Construct, id: string, props: ApiStackPropsI) {
    super(scope, id, props);

    ///////////////////////////////////////////////
    // Upload assets
    ///////////////////////////////////////////////
    // upload lambda assets
    const lambdaS3Assets = new assets.Asset(this, "ChatAppLambdaAssets", {
      path: path.join(__dirname, "../../build/lib/api-stack/lambda"),
    });

    // upload lambda layer assets
    const layerS3Assets = new assets.Asset(this, "ChatAppLayerAssets", {
      path: path.join(
        __dirname,
        "../../build/lib/api-stack/layer/chat-app-layer"
      ),
    });

    ///////////////////////////////////////////////
    // Create lambdas
    ///////////////////////////////////////////////
    // create lambda factory

    ///////////////////////////////////////////////
    // Configure HTTP API
    ///////////////////////////////////////////////
    // create the http api
    this.httpApi = createHttpApi(this, "ChatAppHttpApi");

    ///////////////////////////////////////////////
    // Configure Websocket API
    ///////////////////////////////////////////////
    // create the ws api
    this.wsApi = createWsApi(this, "ChatAppWsApi");
  }
}
