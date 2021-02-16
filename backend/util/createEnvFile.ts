import { GetParametersByPathCommand, SSMClient } from "@aws-sdk/client-ssm";
import * as fs from "fs";
import * as path from "path";

export const createEnvFile = async () => {
  const ssmClient = new SSMClient({ region: "us-east-1" });

  try {
    // fetch the parameters from SSM
    const response = await ssmClient.send(
      new GetParametersByPathCommand({ Path: "/ChatApp/test" })
    );

    // parse a map of the key-value pairs
    const parametersMap = response.Parameters?.reduce(
      (previous, { Name, Value }) => {
        const key = (Name as string).split("/").pop()!.toUpperCase();
        return { ...previous, [key]: Value };
      },
      {}
    );

    // create string to write to file
    const dataString = Object.entries(parametersMap!).reduce(
      (previous, [key, value]) => previous + `${key}=${value}\n`,
      ""
    );

    // write the .env file
    const filename = path.resolve(__dirname, "../../.env");
    fs.writeFile(filename, dataString, (error) => {
      if (error) console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};

createEnvFile();
