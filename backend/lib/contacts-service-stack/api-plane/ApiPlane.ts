import * as cdk from "@aws-cdk/core";
import * as apiGwV2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";

interface ComputePlaneLambda {
  lambda: {
    [key: string]: lambda.CfnFunction;
  };
}

export class ApiPlane extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & ComputePlaneLambda
  ) {
    super(scope, id, props);

    // create invoke policy
    const invokeLambdaPolicy = new iam.CfnManagedPolicy(
      this,
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
      this,
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

    // create api
    const contactsApi = new apiGwV2.CfnApi(this, "ChatAppContactsApi", {
      body: {
        openapi: "3.0.1",
        info: {
          title: "ChatAppContactsApi",
          version: "1.0.0",
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
                credentials: invokeLambdaRole.attrArn,
                type: "aws_proxy",
                httpMethod: "POST",
                uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${props.lambda.postContact.attrArn}/invocations`,
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
                credentials: invokeLambdaRole.attrArn,
                type: "aws_proxy",
                httpMethod: "POST",
                uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${props.lambda.getContact.attrArn}/invocations`,
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
                credentials: invokeLambdaRole.attrArn,
                type: "aws_proxy",
                httpMethod: "POST",
                uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${props.lambda.patchContact.attrArn}/invocations`,
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
                credentials: invokeLambdaRole.attrArn,
                type: "aws_proxy",
                httpMethod: "POST",
                uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${props.lambda.deleteContact.attrArn}/invocations`,
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
                credentials: invokeLambdaRole.attrArn,
                type: "aws_proxy",
                httpMethod: "POST",
                uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${props.lambda.getContacts.attrArn}/invocations`,
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
    new apiGwV2.CfnStage(this, "ChatAppContactsApiTestStage", {
      apiId: contactsApi.ref,
      stageName: "test",
      autoDeploy: true,
    });
  }
}
