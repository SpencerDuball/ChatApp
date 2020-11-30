export const getContact = async (event: any) => {
  return {
    status: 200,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      given_name: "Spencer",
      family_name: "Duball",
      email: "spencerduball@gmail.com",
      sub: "2093948028340-39480243383-234439829483",
    },
  };
};

export const getContacts = async (event: any) => {
  return {
    status: 200,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
    },
    body: [
      {
        given_name: "Spencer",
        family_name: "Duball",
        email: "spencerduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
      {
        given_name: "Luke",
        family_name: "Duball",
        email: "lukeduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
      {
        given_name: "Jerry",
        family_name: "Duball",
        email: "jerryduball@gmail.com",
        sub: "2093948028340-39480243383-234439829483",
      },
    ],
  };
};
