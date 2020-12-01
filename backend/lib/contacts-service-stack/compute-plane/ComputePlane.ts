import * as cdk from "@aws-cdk/core";
import * as assets from "@aws-cdk/aws-s3-assets";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";

export class ComputePlane extends cdk.Stack {
  public lambda: {
    [key: string]: lambda.CfnFunction;
  } = {};

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // upload lambda assets as a .zip to S3
    const lambdaS3AssetsZip = new assets.Asset(this, "ChatAppLambdaAssets", {
      path: path.join(
        __dirname,
        "../../../build/lib/contacts-service-stack/compute-plane/lambda"
      ),
    });

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
      }
    );

    ////////////////////////////////////////////////////////////////////////
    // Create lambda functions
    ////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////
    // contactService
    this.lambda.getContact = new lambda.CfnFunction(
      this,
      "ChatAppGetContactLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contactsService.getContact",
        runtime: "nodejs12.x",
        role: dynamoDbReadRole.attrArn,
        functionName: "ChatAppGetContactLambda",
        description: "This function returns a ChatApp contact by ID.",
      }
    );
    this.lambda.postContact = new lambda.CfnFunction(
      this,
      "ChatAppPostContactLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contactsService.postContact",
        runtime: "nodejs12.x",
        role: dynamoDbWriteRole.attrArn,
        functionName: "ChatAppPostContactLambda",
        description: "This function creates a ChatApp contact.",
      }
    );
    this.lambda.patchContact = new lambda.CfnFunction(
      this,
      "ChatAppPatchContactLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contactsService.patchContact",
        runtime: "nodejs12.x",
        role: dynamoDbWriteRole.attrArn,
        functionName: "ChatAppPatchContactLambda",
        description: "This function patches a ChatApp contact by ID.",
      }
    );
    this.lambda.putContact = new lambda.CfnFunction(
      this,
      "ChatAppPutContactLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contactsService.putContact",
        runtime: "nodejs12.x",
        role: dynamoDbWriteRole.attrArn,
        functionName: "ChatAppPutContactLambda",
        description: "This function puts a ChatApp contact by ID.",
      }
    );
    this.lambda.deleteContact = new lambda.CfnFunction(
      this,
      "ChatAppDeleteContactLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contactsService.deleteContact",
        runtime: "nodejs12.x",
        role: dynamoDbWriteRole.attrArn,
        functionName: "ChatAppDeleteContactLambda",
        description: "This function deletes a ChatApp contact by ID.",
      }
    );

    this.lambda.getContacts = new lambda.CfnFunction(
      this,
      "ChatAppGetContactsLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contactsService.getContacts",
        runtime: "nodejs12.x",
        role: dynamoDbReadRole.attrArn,
        functionName: "ChatAppGetContactsLambda",
        description: "This function returns all contacts of a ChatApp user.",
      }
    );
  }
}
