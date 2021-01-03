import React, { useEffect, useReducer } from "react";
import reducer from "./reducer";
import { IAppContextState, IAppContextReducerAction } from "./types";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "@aws-amplify/auth";
import { ICredentials } from "@aws-amplify/core";
import { aws4Interceptor } from "util/interceptor";
import { API } from "../../api/API";

// create context value
const initialState: IAppContextState = {
  isLoggedIn: false,
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

export const setCredentials = async (
  dispatch: React.Dispatch<IAppContextReducerAction>,
  credentials: ICredentials
) => {
  dispatch({ type: "SET_CREDENTIALS", payload: { credentials } });
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

const useSetCredentials = (
  state: IAppContextState,
  dispatch: React.Dispatch<IAppContextReducerAction>
) => {
  const { isLoggedIn, credentials } = state;
  const setNewCredentials = (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      (async () => {
        const credentials = await Auth.currentCredentials();

        // create new API
        const { accessKeyId, secretAccessKey, sessionToken } = credentials;
        API.interceptors.request.use(
          aws4Interceptor({}, { accessKeyId, secretAccessKey, sessionToken })
        );

        // dispatch new API & credentials
        setCredentials(dispatch, credentials);
      })();
    } else {
      setCredentials(dispatch, null);
    }
  };

  useEffect(() => {
    setNewCredentials(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (credentials) {
      // get new credentials when session expires
      const timeoutMs =
        new Date(credentials["expiration"]).valueOf() - Date.now();
      const timeout = setTimeout(
        async () => setNewCredentials(isLoggedIn),
        timeoutMs
      );

      // clear timeout on dismount
      return () => {
        clearTimeout(timeout);
      };
    }
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
  useSetCredentials(state, dispatch);

  return (
    <AppContext.Provider value={[state, dispatch]} children={props.children} />
  );
};
