import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const STAGE = "test";

const run = async () => {
  const client = new ApiGatewayManagementApiClient({
    region: "us-east-1",
    endpoint: "https://l90sdua83h.execute-api.us-east-1.amazonaws.com/test",
  });
  client.middlewareStack.add(
    (next) => async (args: any) => {
      args.request.path = STAGE + args.request.path;
      return await next(args);
    },
    { step: "build" }
  );
  const post_to_connection = new PostToConnectionCommand({
    Data: Uint8Array.from(Buffer.from(JSON.stringify({ action: "hello" }))),
    ConnectionId: "ZQSgjcDgIAMCErA=",
  });

  try {
    const res = await client.send(post_to_connection);
  } catch (e) {
    console.log(e);
  }
};

run();
