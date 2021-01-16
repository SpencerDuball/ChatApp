import * as cdk from "@aws-cdk/core";
import { ComputePlane } from "./compute-plane/ComputePlane";
import { ApiPlane } from "./api-plane/ApiPlane";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class ComputeStack extends cdk.Stack {
  public apiPlane: ApiPlane;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & { ddbTable: dynamodb.CfnTable }
  ) {
    super(scope, id, props);

    const computePlane = new ComputePlane(this, "ChatAppComputePlane", {
      ddbTable: props.ddbTable,
    });
    this.apiPlane = new ApiPlane(this, "ChatAppApiPlane", {
      lambda: computePlane.lambda,
    });
  }
}
