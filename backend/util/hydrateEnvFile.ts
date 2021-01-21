import { GetParametersByPathCommand, SSMClient } from "@aws-sdk/client-ssm";
import * as fs from "fs";

const run = async () => {
  const getParameters = new GetParametersByPathCommand({
    Path: "/ChatApp/test",
  });
  const ssmClient = new SSMClient({ region: "us-east-1" });

  try {
    const response = await ssmClient.send(getParameters);
    const parameters = response.Parameters.map((item) => [
      item.Name.split("/").pop(),
      item.Value,
    ]);
    const parametersInStrings = parameters.map(
      ([key, value]) => `${key.toUpperCase()}=${value}\n`
    );
    const dataString = parametersInStrings.reduce(
      (previous, current) => previous + current
    );
    fs.writeFile(".env", dataString, (err) => {
      if (err) return console.log(err);
      console.log(".env has been created!");
    });
  } catch (error) {
    console.log(error);
  }
};

run();
