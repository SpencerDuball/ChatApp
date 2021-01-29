#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "@aws-cdk/core";
import { DbStack } from "../lib/db-stack/DbStack";
import { ApiStack } from "../lib/api-stack/ApiStack";
import { AuthStack } from "../lib/auth-stack/AuthStack";

// configure environment variables
dotenv.config();

// if environment variable ENV is not defined: abort
if (process.env.ENV !== "TEST" && process.env.ENV !== "PROD")
  throw new Error(
    `Environment variable "ENV" must be either "TEST" or "PROD".` +
      ` Run this command and try again: > export ENV=TEST`
  );

// create the application
const app = new cdk.App();
const dbStack = new DbStack(app, "ChatAppDbStack");
const apiStack = new ApiStack(app, "ChatAppApiStack", {
  ddbTable: dbStack.dynamoDbTable,
});
const authStack = new AuthStack(app, "ChatAppAuthStack", {
  wsApi: apiStack.wsApi,
  httpApi: apiStack.httpApi,
});

// add 'Project' tag
cdk.Tags.of(app).add("Project", "ChatApp");
