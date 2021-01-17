#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "@aws-cdk/core";
import { DbStack } from "../lib/db-stack/DbStack";
import { ComputeStack } from "../lib/compute-stack/ComputeStack";
import { AuthStack } from "../lib/auth-stack/AuthStack";

// configure environment variables
dotenv.config();

const app = new cdk.App();
const dbStack = new DbStack(app, "DbStack");
const computeStack = new ComputeStack(app, "ContactsServiceStack", {
  ddbTable: dbStack.dynamoDbTable,
});
new AuthStack(app, "AuthStack", {
  contactsApi: computeStack.apiPlane.httpApi,
});

// add 'Project' tag
cdk.Tags.of(app).add("Project", "ChatApp", {
  // prevent from tagging Api Gateway V2. This prevents an error where using the openapi body
  // attribute of the cloudformation resource does not also allow tags to be applied
  excludeResourceTypes: ["AWS::ApiGatewayV2::Api"],
});
