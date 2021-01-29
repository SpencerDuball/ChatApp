if (process.env.ENV !== "TEST" && process.env.ENV !== "PROD")
  throw new Error(
    `Environment variable "ENV" must be eighter "TEST" or "PROD".` +
      `Run this command and try again: ~ export ENV=TEST`
  );

export const stage = process.env.ENV!.toLowerCase();
