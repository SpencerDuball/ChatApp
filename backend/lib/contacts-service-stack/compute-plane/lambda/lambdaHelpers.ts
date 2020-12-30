// get the user sub
const parseCognitoSub = (amr: string[]) => {
  const [cognitoString] = amr.filter((v) => v.includes("CognitoSignIn"));
  return cognitoString.split(":").pop();
};

export const getUserSub = (event: any) => {
  const { amr } = event.requestContext.authorizer.iam.cognitoIdentity;
  return parseCognitoSub(amr);
};
