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

  public createRoute(route: string, lambda: lambda.CfnFunction) {
    const integration = new apigatewayv2.CfnIntegration(
      this.stack,
      `ChatAppHttpApi${capitalize(route)}Integration`,
      {
        apiId: this.ref,
        integrationType: "AWS_PROXY",
      }
    );
  }
}
