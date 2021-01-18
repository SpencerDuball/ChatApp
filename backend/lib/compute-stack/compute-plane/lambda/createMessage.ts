import {
  PostToConnectionCommand,
  ApiGatewayManagementApiClient,
} from "@aws-sdk/client-apigatewaymanagementapi";

export const handler = async (event: any) => {
  console.log(event);

  // constants
  const STAGE = "test";
  const ENDPOINT = `https://${event.requestContext.domainName}/${STAGE}`;
  const CONNECTION_ID = event.requestContext.connectionId;

  // create client
  const client = new ApiGatewayManagementApiClient({
    region: process.env.REGION,
    endpoint: ENDPOINT,
  });
  // add middleware as workaround to https://github.com/aws/aws-sdk-js-v3/issues/1830
  client.middlewareStack.add(
    (next) => async (args: any) => {
      args.request.path = STAGE + args.request.path;
      return await next(args);
    },
    { step: "build" }
  );

  // create command
  const command = new PostToConnectionCommand({
    Data: Uint8Array.from(Buffer.from("this is a connection dawg")),
    ConnectionId: CONNECTION_ID,
  });

  // send the command
  try {
    await client.send(command);
  } catch (e) {
    return { statusCode: 500 };
  }

  return { statusCode: 200 };
};
