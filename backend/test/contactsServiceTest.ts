import * as dotenv from "dotenv";
import axios, { AxiosInstance } from "axios";
import { getTempCredentials } from "../util/getTempCredentials";
import { aws4Interceptor } from "aws4-axios";

// configure environment variables
dotenv.config();

const createContactTest = async (API: AxiosInstance) => {
  const createContactRes = await API.post("/test/contact", {
    sub: "test_user_sub",
    givenName: "Test",
    familyName: "User",
    profilePhotoUrl: "https://www.testurl.com",
    notes: "",
  });
  return createContactRes;
};

const getContactTest = async (API: AxiosInstance) => {
  const getContactRes = await API.get("/test/contact/test_user_sub");
  return getContactRes;
};

const deleteContactTest = async (API: AxiosInstance) => {
  const deleteContactRes = await API.delete(
    "/test/contact/d1653350-03bd-4cb9-b256-afe4f250d4a2"
  );
  return deleteContactRes;
};

const getContactsTest = async (API: AxiosInstance) => {
  const getContactsRes = await API.get("/test/contacts");
  return getContactsRes;
};

const updateContactTest1 = async (API: AxiosInstance) => {
  const updateContactRes = await API.patch("/test/contact/test_user_sub", {
    givenName: "Leroy",
    notes: "Hello there this is notes.",
  });
  return updateContactRes;
};

const updateContactTest2 = async (API: AxiosInstance) => {
  const updateContactRes = await API.patch("/test/contact/test_user_sub", {
    familyName: "Jenkinsaaaahhhh",
    notes: "This update has finished",
  });
  return updateContactRes;
};

(async () => {
  // get credentials
  const { Credentials } = await getTempCredentials({
    region: process.env.REGION!,
    userPoolId: process.env.USER_POOL_ID!,
    userPoolClientId: process.env.USER_POOL_CLIENT_ID!,
    identityPoolId: process.env.IDENTITY_POOL_ID!,
  })(process.env.USERNAME!, process.env.PASSWORD!);

  // setup aws4 interceptor
  const API = axios.create({
    baseURL: process.env.HTTP_API_URL,
  });
  API.interceptors.request.use(
    aws4Interceptor(
      {},
      {
        accessKeyId: Credentials!.AccessKeyId!,
        secretAccessKey: Credentials!.SecretKey!,
        sessionToken: Credentials!.SessionToken!,
      }
    )
  );

  try {
    // console.log((await createContactTest(API)).data);
    // console.log((await getContactTest(API)).data);
    // console.log((await updateContactTest1(API)).data);
    // console.log((await updateContactTest2(API)).data);
    // console.log((await deleteContactTest(API)).data);
    // console.log((await getContactsTest(API)).data);
  } catch (error) {
    console.log(error.data);
  }
})();
