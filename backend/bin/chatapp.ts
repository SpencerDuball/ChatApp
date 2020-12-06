#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "@aws-cdk/core";
import { DbStack } from "../lib/db-stack/db-stack";
import { ContactsServiceStack } from "../lib/contacts-service-stack/contacts-service-stack";
import { AuthStack } from "../lib/auth-stack/auth-stack";

// configure environment variables
dotenv.config();

const app = new cdk.App();
new DbStack(app, "DbStack");
const contactsServiceStack = new ContactsServiceStack(
  app,
  "ContactsServiceStack"
);
new AuthStack(app, "AuthStack", {
  contactsApi: contactsServiceStack.apiPlane.contactsApi,
});

// add 'Project' tag
cdk.Tags.of(app).add("Project", "ChatApp", {
  // prevent from tagging Api Gateway V2. This prevents an error where using the openapi body
  // attribute of the cloudformation resource does not also allow tags to be applied
  excludeResourceTypes: ["AWS::ApiGatewayV2::Api"],
});
