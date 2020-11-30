import * as cdk from "@aws-cdk/core";
import * as apiGwV2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";

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

    // create invoke role

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
            get: {
              responses: {
                default: {
                  description: "Default response for GET /contact",
                },
              },
            },
            "x-amazon-apigateway-integration": {
              $ref: "#/components/x-amazon-apigateway-integrations/getContact",
            },
          },
          "/contacts": {
            get: {
              responses: {
                default: {
                  description: "Default response for GET /contacts",
                },
              },
            },
            "x-amazon-apigateway-integration": {
              $ref: "#/components/x-amazon-apigateway-integrations/getContacts",
            },
          },
        },
        components: {
          "x-amazon-apigateway-integrations": {
            getContact: {
              type: "aws_proxy",
              uri: props.lambda.getContact.attrArn,
              httpMethod: "POST",
              payloadFormatVersion: "2.0",
            },
            getContacts: {
              type: "aws_proxy",
              uri: props.lambda.getContacts.attrArn,
              httpMethod: "POST",
              payloadFormatVersion: "2.0",
            },
          },
        },
      },
    });

    // create test stage
    new apiGwV2.CfnStage(this, "ChatAppContactsApiTestStage", {
      apiId: contactsApi.ref,
      stageName: "test",
    });
  }
}
