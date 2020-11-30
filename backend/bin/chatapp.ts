#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "@aws-cdk/core";
import { ContactsServiceStack } from "../lib/contacts-service-stack/contacts-service-stack";

// configure environment variables
dotenv.config();

const app = new cdk.App();
new ContactsServiceStack(app, "ContactsServiceStack");
