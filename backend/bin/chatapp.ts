#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "@aws-cdk/core";

// configure environment variables
dotenv.config();

// create the application
const app = new cdk.App();

// add 'Project' tag
cdk.Tags.of(app).add("Project", "ChatApp");
