import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

const S = (attributeName: string) => ({ attributeName, attributeType: "S" });

interface DbStackPropsI extends cdk.StackProps {}

export class DbStack extends cdk.Stack {
  public dynamoDbTable: dynamodb.CfnTable;

  constructor(scope: cdk.Construct, id: string, props?: DbStackPropsI) {
    super(scope, id, props);

    this.dynamoDbTable = new dynamodb.CfnTable(this, "ChatAppDDBTable", {
      attributeDefinitions: [S("PK"), S("SK"), S("GSIPK"), S("GSISK")],
      billingMode: "PAY_PER_REQUEST",
      keySchema: [
        { attributeName: "PK", keyType: "HASH" },
        { attributeName: "SK", keyType: "RANGE" },
      ],
      tableName: "ChatAppDDBTable",
      globalSecondaryIndexes: [
        {
          indexName: "UserChats",
          keySchema: [
            { attributeName: "GSIPK", keyType: "HASH" },
            { attributeName: "GSISK", keyType: "RANGE" },
          ],
          projection: {
            projectionType: "KEYS_ONLY",
          },
        },
      ],
    });
  }
}
