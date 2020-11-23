import * as React from "react";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

interface IAuthContext {}

const initialAuthContext = {};

export const AuthContext = React.createContext<IAuthContext>(
  initialAuthContext
);

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  return <AuthContext.Provider value={{}} {...props} />;
};
