import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import { capitalize } from "../../../util/stringUtil";

const stage = process.env.ENV!.toLowerCase();

interface HttpApiPropsI {}

export class HttpApi extends apigatewayv2.CfnApi {
  constructor(scope: cdk.Stack, id: string, props?: HttpApiPropsI) {
    super(scope, id, {
      corsConfiguration: {
        allowOrigins: ["*"],
        allowHeaders: ["*"],
        allowMethods: ["*"],
      },
      description: "The HTTP API for ChatApp.",
      name: "ChatAppHttpApi",
      protocolType: "HTTP",
    });

    new apigatewayv2.CfnStage(
      scope,
      `ChatAppHttpApiStage-${capitalize(stage)}`,
      {
        apiId: this.ref,
        stageName: stage,
        autoDeploy: true,
      }
    );
  }

  public createRoute(
    id: string,
    routeKey: string,
    lambda: lambda.CfnFunction,
    role: iam.CfnRole
  ) {
    const integration = new apigatewayv2.CfnIntegration(
      this.stack,
      `ChatAppHttpApi${id}Integration`,
      {
        apiId: this.ref,
        credentialsArn: role.attrArn,
        integrationType: "AWS_PROXY",
        integrationUri: `arn:aws:apigateway:${this.stack.region}:lambda:path/2015-03-31/functions/${lambda.attrArn}/invocations`,
        payloadFormatVersion: "2.0",
      }
    );
    new apigatewayv2.CfnRoute(this.stack, `ChatAppHttpApi${id}Route`, {
      apiId: this.ref,
      authorizationType: "AWS_IAM",
      routeKey: routeKey, // ex: "GET /pets"
      target: `integrations/${integration.ref}`,
    });
  }
}
