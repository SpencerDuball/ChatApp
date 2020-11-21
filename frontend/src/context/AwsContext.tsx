import * as React from "react";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

const initialContextValue = {};

export const AwsContext = React.createContext(initialContextValue);
