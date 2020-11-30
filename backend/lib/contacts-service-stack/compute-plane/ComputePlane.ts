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

    // create roles for lambda
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
        managedPolicyArns: [
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        ],
      }
    );

    // create lambda - GetContact
    this.lambda.getContact = new lambda.CfnFunction(
      this,
      "ChatAppGetContactLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contacts.getContact",
        runtime: "nodejs12.x",
        role: dynamoDbReadRole.attrArn,
        functionName: "ChatAppGetContactLambda",
        description: "This function returns a ChatApp contact by ID.",
      }
    );

    // create lambda - GetContacts
    this.lambda.getContacts = new lambda.CfnFunction(
      this,
      "ChatAppGetContactsLambda",
      {
        code: {
          s3Bucket: lambdaS3AssetsZip.s3BucketName,
          s3Key: lambdaS3AssetsZip.s3ObjectKey,
        },
        handler: "contacts.getContacts",
        runtime: "nodejs12.x",
        role: dynamoDbReadRole.attrArn,
        functionName: "ChatAppGetContactsLambda",
        description: "This function returns all contacts of a ChatApp user.",
      }
    );
  }
}
