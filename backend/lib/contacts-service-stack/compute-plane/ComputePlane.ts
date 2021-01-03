import * as cdk from "@aws-cdk/core";
import * as assets from "@aws-cdk/aws-s3-assets";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as path from "path";

export class ComputePlane extends cdk.Stack {
  public lambda: {
    [key: string]: lambda.CfnFunction;
  } = {};

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & { ddbTable: dynamodb.CfnTable }
  ) {
    super(scope, id, props);

    // upload lambda assets as a .zip to S3
    const lambdaS3AssetsZip = new assets.Asset(this, "ChatAppLambdaAssets", {
      path: path.join(
        __dirname,
        "../../../build/lib/contacts-service-stack/compute-plane/lambda"
      ),
    });

    // upload lambda layer assets as a .zip to S3
    const contactsServiceLayerS3Assets = new assets.Asset(
      this,
      "ChatAppLambdaLayerAssets",
      {
        path: path.join(__dirname, "layers/contacts-service-layer"),
      }
    );

    ////////////////////////////////////////////////////////////////////////
    // create roles for lambda
    ////////////////////////////////////////////////////////////////////////
    const AWSLambdaBasicExecutionRole =
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole";
    const dynamoDbReadRole = new iam.CfnRole(
      this,
      "ChatAppDDBReadRoleForLambda",
      {
        assumeRolePolicyDocument: iam.PolicyDocument.fromJson({
          Statement: [
            {
              Effect: "Allow",
              Principal: { Service: ["lambda.amazonaws.com"] },
              Action: ["sts:AssumeRole"],
            },
          ],
        }),
        managedPolicyArns: [AWSLambdaBasicExecutionRole],
        policies: [
          {
            policyDocument: iam.PolicyDocument.fromJson({
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    "dynamodb:BatchGetItem",
                    "dynamodb:ConditionCheckItem",
                    "dynamodb:GetItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                  ],
                  Resource: [
                    `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.ddbTable.ref}`,
                    `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.ddbTable.ref}/index`,
                  ],
                },
              ],
            }),
            policyName: "ChatAppDDBReadPolicy",
          },
        ],
      }
    );

    const dynamoDbWriteRole = new iam.CfnRole(
      this,
      "ChatAppDDBWriteRoleForLambda",
      {
        assumeRolePolicyDocument: iam.PolicyDocument.fromJson({
          Statement: [
            {
              Effect: "Allow",
              Principal: { Service: ["lambda.amazonaws.com"] },
              Action: ["sts:AssumeRole"],
            },
          ],
        }),
        managedPolicyArns: [AWSLambdaBasicExecutionRole],
        policies: [
          {
            policyDocument: iam.PolicyDocument.fromJson({
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    // read
                    "dynamodb:BatchGetItem",
                    "dynamodb:ConditionCheckItem",
                    "dynamodb:GetItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    // write
                    "dynamodb:BatchWriteItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                  ],
                  Resource: [
                    `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.ddbTable.ref}`,
                    `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.ddbTable.ref}/index`,
                  ],
                },
              ],
            }),
            policyName: "ChatAppDDBReadPolicy",
          },
        ],
      }
    );

    ////////////////////////////////////////////////////////////////////////
    // Create lambda layers
    ////////////////////////////////////////////////////////////////////////
    const computeServiceLambdaLayer = new lambda.CfnLayerVersion(
      this,
      "ComputeServiceLambdaLayer",
      {
        compatibleRuntimes: ["nodejs12.x"],
        content: {
          s3Bucket: contactsServiceLayerS3Assets.s3BucketName,
          s3Key: contactsServiceLayerS3Assets.s3ObjectKey,
        },
        description: "This is a lambdah laier.",
        layerName: "ComputeServiceLambdaLayer",
      }
    );
    const computeServiceLayerPermission = new lambda.CfnLayerVersionPermission(
      this,
      "ComputeServiceLayerPermission",
      {
        action: "lambda:GetLayerVersion",
        layerVersionArn: computeServiceLambdaLayer.ref,
        principal: this.account,
      }
    );

    ////////////////////////////////////////////////////////////////////////
    // Create lambda functions
    ////////////////////////////////////////////////////////////////////////
    const computePlaneLambda = (
      name: string,
      handler: string,
      description: string,
      role: iam.CfnRole
    ) => {
      return new lambda.CfnFunction(this, name, {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        environment: {
          variables: {
            DDB_TABLE_NAME: props.ddbTable.tableName!,
            REGION: this.region,
          },
        },
        layers: [computeServiceLambdaLayer.ref],
        handler,
        runtime: "nodejs12.x",
        role: role.attrArn,
        functionName: name,
        description,
      });
    };

    // contactService
    this.lambda.getContact = computePlaneLambda(
      "ChatAppGetContactLambda",
      "getContact.handler",
      "This function returns a ChatApp contact by ID.",
      dynamoDbReadRole
    );
    this.lambda.postContact = computePlaneLambda(
      "ChatAppPostContactLambda",
      "createContact.handler",
      "This function creates a ChatApp contact.",
      dynamoDbWriteRole
    );
    this.lambda.patchContact = computePlaneLambda(
      "ChatAppPatchContactLambda",
      "updateContact.handler",
      "This function patches a ChatApp contact by ID.",
      dynamoDbWriteRole
    );
    this.lambda.deleteContact = computePlaneLambda(
      "ChatAppDeleteContactLambda",
      "deleteContact.handler",
      "This function deletes a ChatApp contact by ID.",
      dynamoDbWriteRole
    );
    this.lambda.getContacts = computePlaneLambda(
      "ChatAppGetContactsLambda",
      "getContacts.handler",
      "This function returns all contacts of a ChatApp user.",
      dynamoDbReadRole
    );
  }
}
