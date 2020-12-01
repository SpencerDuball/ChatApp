// contact
export const getContact = async (event: any) => {
  if (event.queryStringParameters.id) {
    return {
      status: 200,
      body: {
        given_name: "Spencer",
        family_name: "Duball",
        email: "spencerduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
    };
  } else {
    return {
      status: 400,
      body: {
        message: "Bad request, no ID was supplied as a query string parameter.",
      },
    };
  }
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
  if (event.queryStringParameters.id) {
    return {
      status: 200,
      body: {
        given_name: "Spencer",
        family_name: "Duball",
        email: "spencerduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
        message: "User was successfully patched with a PATCH!",
      },
    };
  } else {
    return {
      status: 400,
      body: {
        message: "Bad request, no ID was supplied as a query string parameter.",
      },
    };
  }
};
export const putContact = async (event: any) => {
  if (event.queryStringParameters.id) {
    return {
      status: 200,
      body: {
        given_name: "Spencer",
        family_name: "Duball",
        email: "spencerduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
        message: "User was successfully replaced with a PUT!",
      },
    };
  } else {
    return {
      status: 400,
      body: {
        message: "Bad request, no ID was supplied as a query string parameter.",
      },
    };
  }
};
export const deleteContact = async (event: any) => {
  if (event.queryStringParameters.id) {
    return {
      status: 200,
      body: {
        given_name: "Spencer",
        family_name: "Duball",
        email: "spencerduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
        message: "User was successfully deleted with a DELETE!",
      },
    };
  } else {
    return {
      status: 400,
      body: {
        message: "Bad request, no ID was supplied as a query string parameter.",
      },
    };
  }
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
