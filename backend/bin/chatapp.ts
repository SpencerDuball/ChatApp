#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "@aws-cdk/core";
import { ContactsServiceStack } from "../lib/contacts-service-stack/contacts-service-stack";

// configure environment variables
dotenv.config();

const app = new cdk.App();
new ContactsServiceStack(app, "ContactsServiceStack");

// add 'Project' tag
cdk.Tags.of(app).add("Project", "ChatApp", {
  // prevent from tagging Api Gateway V2. This prevents an error where using the openapi body
  // attribute of the cloudformation resource does not also allow tags to be applied
  excludeResourceTypes: ["AWS::ApiGatewayV2::Api"],
});
