// contact
export const getContact = async (event: any) => {
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
