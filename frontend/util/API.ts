import axios from "axios";
import { aws4Interceptor } from "./interceptor";
import { Auth } from "aws-amplify";
Auth.Credentials.get();

const getAccessKey = () => {
  const userSub = localStorage.getItem(
    `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}.LastAuthUser`
  );
  return localStorage.getItem(
    `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}.${userSub}.accessToken`
  );
};

const getSecretAccessKey = () => {
  const userSub = localStorage.getItem(
    `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}.LastAuthUser`
  );
  return localStorage.getItem(
    `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}.${userSub}.`
  );
};

export const API = axios.create({
  baseURL: "https://9lmy17l4sa.execute-api.us-east-1.amazonaws.com",
});

API.interceptors.request.use(
  aws4Interceptor(
    {},
    {
      accessKeyId: () => "access_key",
      secretAccessKey: () => "secret_access_key",
      sessionToken: () => "session_token",
    }
  )
);
