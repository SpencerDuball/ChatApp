import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const parseCognitoSub = (amr: string[]) => {
  const [cognitoString] = amr.filter((value) =>
    value.includes("CognitoSignIn")
  );
  return cognitoString.split(":").pop();
};

// contact
export const getContact = async (event: any) => {
  console.log(event);
  console.log(event.requestContext.authorizer);
  console.log(event.requestContext.authorizer.iam.cognitoIdentity.amr);
  console.log(
    parseCognitoSub(event.requestContext.authorizer.iam.cognitoIdentity.amr)
  );

  return {
    status: 200,
    body: {
      id: event.pathParameters.id,
      given_name: "Spencer",
      family_name: "Duball",
      email: "spencerduball@gmail.com",
      sub: "2093948028340-39480243383-234439829483",
    },
  };
};
export const postContact = async (event: any) => {
  console.log(event);

  return {
    status: 200,
    body: {
      given_name: "Spencer",
      family_name: "Duball",
      email: "spencerduball@gmail.com",
      sub: "2093948028340-39480243383-234439829483",
      message: "User was successfully created with a POST!",
    },
  };
};
export const patchContact = async (event: any) => {
  console.log(event);

  return {
    status: 200,
    body: {
      id: event.pathParameters.id,
      given_name: "Spencer",
      family_name: "Duball",
      email: "spencerduball@gmail.com",
      sub: "2093948028340-39480243383-234439829483",
      message: "User was successfully patched with a PATCH!",
    },
  };
};
export const deleteContact = async (event: any) => {
  console.log(event);

  return {
    status: 200,
    body: {
      id: event.pathParameters.id,
      given_name: "Spencer",
      family_name: "Duball",
      email: "spencerduball@gmail.com",
      sub: "2093948028340-39480243383-234439829483",
      message: "User was successfully deleted with a DELETE!",
    },
  };
};

// contacts
export const getContacts = async (event: any) => {
  console.log(event);

  return {
    status: 200,
    body: [
      {
        given_name: "Jerry",
        family_name: "Macguire",
        email: "jerrymacguire@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
      {
        given_name: "Portia",
        family_name: "Doubleday",
        email: "portiadoubleday@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
      {
        given_name: "Rami",
        family_name: "Malek",
        email: "ramimalek@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
    ],
  };
};
