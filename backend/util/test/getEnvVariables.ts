import * as dotenv from "dotenv";

// configure environment variables
dotenv.config();

/**
 * Gets a map of environment variables.
 *
 * @param envVariables The required environment variables.
 */
export const getEnvVariables = (envVariables: string[]) => {
  // check if environment variables exist
  let isEnvUndefined = envVariables
    .map((value) => process.env[value])
    .some((value) => value === undefined);

  // if the environment variables don't exist then throw error
  if (isEnvUndefined)
    throw new Error(
      "EnvError: The required environment variables do not exist. " +
        "Please check that all environment variables expected exist at runtime."
    );

  // return a map of env variables
  return envVariables.reduce(
    (previous, current) => ({ [current]: process.env[current], ...previous }),
    {}
  );
};
