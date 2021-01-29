import * as cdk from "@aws-cdk/core";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as assets from "@aws-cdk/aws-s3-assets";
import * as path from "path";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { capitalize } from "../../util/stringUtil";
import { WsApi } from "./constructs/WsApi";
import { HttpApi } from "./constructs/HttpApi";
import { stage } from "../globals";

/**
 * Create the InvokeLambdaRole for WsApi and HttpApi.
 * @param scope
 * @param props
 */
const createInvokeLambdaRole = (
  scope: cdk.Stack,
  lambdas: lambda.CfnFunction[]
) => {
  // create policy
  const invokeLambdaPolicy = {
    policyName: "ChatAppInvokeLambdaPolicy",
    policyDocument: iam.PolicyDocument.fromJson({
      Statement: [
        {
          Effect: "Allow",
          Action: ["lambda:InvokeFunction"],
          Resource: Object.values(lambdas).map((lambda) => lambda.attrArn),
        },
      ],
    }),
  };

  // create & return role
  return new iam.CfnRole(scope, "ChatAppInvokeLambdaRole", {
    assumeRolePolicyDocument: iam.PolicyDocument.fromJson({
      Statement: [
        {
          Effect: "Allow",
          Principal: { Service: ["apigateway.amazonaws.com"] },
          Action: ["sts:AssumeRole"],
        },
      ],
    }),
    policies: [invokeLambdaPolicy],
  });
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
    `arn:aws:execute-api:${scope.region}:${scope.account}:${props.wsApi.ref}/${stage}/*`,
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
  new lambda.CfnLayerVersionPermission(
    scope,
    "ChatAppApiLambdaLayerPermission",
    {
      action: "lambda:GetLayerVersion",
      layerVersionArn: computeServiceLambdaLayer.ref,
      principal: scope.account,
    }
  );

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
) => (name: string, handler: string, role: iam.CfnRole) => {
  // construct construct id
  // handler should have name = myFunction.handler
  const id = `ChatApp${name}Lambda`;

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

interface ApiStackPropsI extends cdk.StackProps {
  ddbTable: dynamodb.CfnTable;
}

export class ApiStack extends cdk.Stack {
  public httpApi: HttpApi;
  public wsApi: WsApi;
  private apiLambdaLayer: lambda.CfnLayerVersion;
  private lambdas: { [name: string]: lambda.CfnFunction } = {};

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
      path: path.join(__dirname, "./layers/chat-app-layer"),
    });
    ///////////////////////////////////////////////

    // create the http api
    this.httpApi = new HttpApi(this, "ChatAppHttpApi");

    // create the ws api
    this.wsApi = new WsApi(this, "ChatAppWsApi");

    ///////////////////////////////////////////////
    // Create lambdas
    ///////////////////////////////////////////////
    // create lambda roles
    const { dynamodbReadRole, dynamodbWriteRole } = createLambdaRoles(this, {
      ddbTable: props.ddbTable,
      wsApi: this.wsApi,
    });

    // create lambda layer
    this.apiLambdaLayer = createApiLambdaLayer(this, { layerS3Assets });

    // create lambda factory
    const lambdaFactory = createLambdaFactory(this, {
      assetsZip: lambdaS3Assets,
      ddbTable: props.ddbTable,
      layers: [this.apiLambdaLayer],
    });

    // create lambdas
    this.lambdas.addConnectionToChat = lambdaFactory(
      "AddConnectionToChat",
      "addConnectionToChat.handler",
      dynamodbWriteRole
    );
    this.lambdas.addUserToChat = lambdaFactory(
      "AddUserToChat",
      "addUserToChat.handler",
      dynamodbWriteRole
    );
    this.lambdas.connect = lambdaFactory(
      "Connect",
      "connect.handler",
      dynamodbWriteRole
    );
    this.lambdas.createChat = lambdaFactory(
      "CreateChat",
      "createChat.handler",
      dynamodbWriteRole
    );
    this.lambdas.disconnect = lambdaFactory(
      "Disconnect",
      "disconnect.handler",
      dynamodbWriteRole
    );
    this.lambdas.getChats = lambdaFactory(
      "GetChats",
      "getChats.handler",
      dynamodbReadRole
    );
    this.lambdas.removeUserFromChat = lambdaFactory(
      "RemoveUserFromChat",
      "removeUserFromChat.handler",
      dynamodbWriteRole
    );
    this.lambdas.updateChat = lambdaFactory(
      "UpdateChat",
      "updateChat.handler",
      dynamodbWriteRole
    );
    this.lambdas.createContact = lambdaFactory(
      "CreateContact",
      "createContact.handler",
      dynamodbWriteRole
    );
    this.lambdas.deleteContact = lambdaFactory(
      "DeleteContact",
      "deleteContact.handler",
      dynamodbWriteRole
    );
    this.lambdas.getContact = lambdaFactory(
      "GetContact",
      "getContact.handler",
      dynamodbReadRole
    );
    this.lambdas.getContacts = lambdaFactory(
      "GetContacts",
      "getContacts.handler",
      dynamodbReadRole
    );
    this.lambdas.updateContact = lambdaFactory(
      "UpdateContact",
      "updateContact.handler",
      dynamodbWriteRole
    );
    ///////////////////////////////////////////////

    // create role for WsApi & HttpApi to invoke lambdas
    const invokeLambdaRole = createInvokeLambdaRole(
      this,
      Object.values(this.lambdas)
    );

    ///////////////////////////////////////////////
    // Create routes & integrations
    ///////////////////////////////////////////////
    this.wsApi.createConnectRoute(this.lambdas.connect, invokeLambdaRole);
    this.wsApi.createDisconnectRoute(this.lambdas.disconnect, invokeLambdaRole);
    this.wsApi.createRoute(
      "deleteContact",
      this.lambdas.deleteContact,
      invokeLambdaRole
    );
    this.wsApi.createRoute(
      "updateContact",
      this.lambdas.updateContact,
      invokeLambdaRole
    );
    this.wsApi.createRoute(
      "createContact",
      this.lambdas.createContact,
      invokeLambdaRole
    );
    this.wsApi.createRoute(
      "createChat",
      this.lambdas.createChat,
      invokeLambdaRole
    );
    this.wsApi.createRoute(
      "updateChat",
      this.lambdas.updateChat,
      invokeLambdaRole
    );
    this.wsApi.createRoute(
      "addUserToChat",
      this.lambdas.addUserToChat,
      invokeLambdaRole
    );
    this.wsApi.createRoute(
      "addConnectionToChat",
      this.lambdas.addConnectionToChat,
      invokeLambdaRole
    );
  }
}
