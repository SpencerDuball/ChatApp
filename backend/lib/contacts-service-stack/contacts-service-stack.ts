import * as cdk from "@aws-cdk/core";
import { ComputePlane } from "./compute-plane/ComputePlane";
import { ApiPlane } from "./api-plane/ApiPlane";

export class ContactsServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const computePlane = new ComputePlane(this, "ChatAppComputePlane");
    new ApiPlane(this, "ChatAppApiPlane", {
      lambda: computePlane.lambda,
    });
  }
}
