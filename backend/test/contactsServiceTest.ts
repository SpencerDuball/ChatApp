import * as dotenv from "dotenv";
import axios, { AxiosInstance } from "axios";
import { getTempCredentials } from "../util/getTempCredentials";
import { aws4Interceptor } from "aws4-axios";

// configure environment variables
dotenv.config();

const createContactTest = async (API: AxiosInstance) =>
  await API.post("/test/contact", {
    sub: "test_user_sub",
    givenName: "Test",
    familyName: "User",
    profilePhotoUrl: "https://www.testurl.com",
    notes: "",
  });

const getContactTest = async (API: AxiosInstance) =>
  await API.get("/test/contact/test_user_sub");

const deleteContactTest = async (API: AxiosInstance) =>
  await API.delete("/test/contact/d1653350-03bd-4cb9-b256-afe4f250d4a2");

const getContactsTest = async (API: AxiosInstance) =>
  await API.get("/test/contacts");

const updateContactTest1 = async (API: AxiosInstance) =>
  await API.patch("/test/contact/test_user_sub", {
    givenName: "Leroy",
    notes: "Hello there this is notes.",
  });

const updateContactTest2 = async (API: AxiosInstance) =>
  await API.patch("/test/contact/test_user_sub", {
    familyName: "Jenkinsaaaahhhh",
    notes: "This update has finished",
  });

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
