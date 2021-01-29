import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import { capitalize } from "../../../util/stringUtil";

const stage = process.env.ENV!.toLowerCase();

interface WsApiPropsI {}

export class WsApi extends apigatewayv2.CfnApi {
  constructor(scope: cdk.Stack, id: string, props?: WsApiPropsI) {
    super(scope, id, {
      apiKeySelectionExpression: "$request.header.x-api-key",
      description: "The Websocket API for ChatApp.",
      name: "ChatAppWsApi",
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.action",
    });

    new apigatewayv2.CfnStage(scope, `ChatAppWsApiStage-${capitalize(stage)}`, {
      apiId: this.ref,
      stageName: stage,
      autoDeploy: true,
    });
  }

  public createConnectRoute(lambda: lambda.CfnFunction, role: iam.CfnRole) {
    const integration = new apigatewayv2.CfnIntegration(
      this.stack,
      `ChatAppWsApiConnectIntegration`,
      {
        apiId: this.ref,
        integrationType: "AWS_PROXY",
        integrationUri: `arn:aws:apigateway:${this.stack.region}:lambda:path/2015-03-31/functions/${lambda.attrArn}/invocations`,
        credentialsArn: role.attrArn,
      }
    );
    new apigatewayv2.CfnRoute(this.stack, "ChatAppWsApiConnectRoute", {
      apiId: this.ref,
      apiKeyRequired: false,
      authorizationType: "AWS_IAM",
      routeKey: "$connect",
      target: `integrations/${integration.ref}`,
    });
  }

  public createDisconnectRoute(lambda: lambda.CfnFunction, role: iam.CfnRole) {
    const integration = new apigatewayv2.CfnIntegration(
      this.stack,
      `ChatAppWsApiDisconnectIntegration`,
      {
        apiId: this.ref,
        integrationType: "AWS_PROXY",
        integrationUri: `arn:aws:apigateway:${this.stack.region}:lambda:path/2015-03-31/functions/${lambda.attrArn}/invocations`,
        credentialsArn: role.attrArn,
      }
    );
    new apigatewayv2.CfnRoute(this.stack, "ChatAppWsApiDisonnectRoute", {
      apiId: this.ref,
      routeKey: "$disconnect",
      target: `integrations/${integration.ref}`,
    });
  }

  public createRoute(
    routeKey: string,
    lambda: lambda.CfnFunction,
    role: iam.CfnRole
  ) {
    const integration = new apigatewayv2.CfnIntegration(
      this.stack,
      `ChatAppWsApi${capitalize(routeKey)}Integration`,
      {
        apiId: this.ref,
        integrationType: "AWS_PROXY",
        integrationUri: `arn:aws:apigateway:${this.stack.region}:lambda:path/2015-03-31/functions/${lambda.attrArn}/invocations`,
        credentialsArn: role.attrArn,
      }
    );
    new apigatewayv2.CfnRoute(
      this.stack,
      `ChatAppWsApi${capitalize(routeKey)}Route`,
      {
        apiId: this.ref,
        routeKey,
        target: `integrations/${integration.ref}`,
      }
    );
  }
}
