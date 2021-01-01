import React, { useEffect, useReducer } from "react";
import reducer from "./reducer";
import { IAppContextState, IAppContextReducerAction } from "./types";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "@aws-amplify/auth";
import axios, { AxiosInstance } from "axios";
import { ICredentials } from "@aws-amplify/core";
import { aws4Interceptor } from "@frontend/util/interceptor";

// create context value
const initialState: IAppContextState = {
  isLoggedIn: false,
  API: null,
  credentials: null,
};

// create context
export const AppContext = React.createContext<
  [IAppContextState, React.Dispatch<IAppContextReducerAction>]
>(null!);
AppContext.displayName = "AppContext";

//////////////////////////////////////////////////////////////////////////////
// Dispatch Functions
//////////////////////////////////////////////////////////////////////////////
export const setIsLoggedIn = (
  dispatch: React.Dispatch<IAppContextReducerAction>,
  isLoggedIn: boolean
) => {
  dispatch({ type: "SET_IS_LOGGED_IN", payload: { isLoggedIn } });
};

export const signIn = async (
  dispatch: React.Dispatch<IAppContextReducerAction>,
  username: string,
  password: string
): Promise<CognitoUser> => {
  const signInResult = await Auth.signIn({
    username: username,
    password: password,
  });
  setIsLoggedIn(dispatch, true);
  return signInResult;
};

export const setApiAndCredentials = async (
  dispatch: React.Dispatch<IAppContextReducerAction>,
  API: AxiosInstance,
  credentials: ICredentials
) => {
  dispatch({ type: "SET_API_AND_CREDENTIALS", payload: { API, credentials } });
};

export const signUp = async (input: {
  email: string;
  password: string;
}): Promise<CognitoUser> => {
  const signUpResult = await Auth.signUp({
    username: input.email,
    password: input.password,
  });
  return signUpResult.user;
};

//////////////////////////////////////////////////////////////////////////////
// Hooks
//////////////////////////////////////////////////////////////////////////////
const useLocalStorageLogin = (
  dispatch: React.Dispatch<IAppContextReducerAction>
) => {
  useEffect(() => {
    (async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsLoggedIn(dispatch, true);
      } catch (error) {
        // an error is thrown if there is no user, simply return
        return;
      }
    })();
  }, []);
};

const useSetApiAndCredentials = (
  state: IAppContextState,
  dispatch: React.Dispatch<IAppContextReducerAction>
) => {
  const { isLoggedIn, credentials } = state;
  const setNewCredentials = async (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      const credentials = await Auth.currentCredentials();

      // create new API
      const API = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
      });
      const { accessKeyId, secretAccessKey, sessionToken } = credentials;
      API.interceptors.request.use(
        aws4Interceptor({}, { accessKeyId, secretAccessKey, sessionToken })
      );

      // dispatch new API & credentials
      setApiAndCredentials(dispatch, API, credentials);
    } else {
      setApiAndCredentials(dispatch, null, null);
    }
  };

  useEffect(() => {
    setNewCredentials(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    const run = async () => {
      if (credentials) {
        const timeoutMs =
          new Date(credentials["expiration"]).valueOf() - Date.now();
        setTimeout(async () => await setNewCredentials(isLoggedIn), timeoutMs);
      }
    };
    run();
  }, [credentials]);
};

//////////////////////////////////////////////////////////////////////////////
// Provider
//////////////////////////////////////////////////////////////////////////////
export const AppContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // check for user in local storage
  useLocalStorageLogin(dispatch);

  // set API and Credentials
  useSetApiAndCredentials(state, dispatch);

  return (
    <AppContext.Provider value={[state, dispatch]} children={props.children} />
  );
};
