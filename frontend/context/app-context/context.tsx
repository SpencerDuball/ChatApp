import React, { useEffect, useReducer } from "react";
import reducer from "./reducer";
import { IAppContextState, IAppContextReducerAction } from "./types";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

// create context value
const initialState: IAppContextState = {
  isLoggedIn: false,
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

//////////////////////////////////////////////////////////////////////////////
// Provider
//////////////////////////////////////////////////////////////////////////////
export const AppContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // check for user in local storage
  useLocalStorageLogin(dispatch);

  return (
    <AppContext.Provider value={[state, dispatch]} children={props.children} />
  );
};
