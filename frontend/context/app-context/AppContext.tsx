import React, { useEffect, useReducer } from "react";
import appContextReducer from "./app-context-reducer";
import {
  IAppContextState,
  IAppContextReducerAction,
} from "./app-context-types";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";

// create context value
const initialState: IAppContextState = {
  isLoggedIn: false,
};

// create context
export const AppContext = React.createContext<
  [IAppContextState, React.Dispatch<IAppContextReducerAction>]
>(null!);
AppContext.displayName = "AppContext";

//////////////////////////////////////////////////////////////////////////////////
// Dispatch Functions
//////////////////////////////////////////////////////////////////////////////////
export const setIsLoggedIn = (
  dispatch: React.Dispatch<IAppContextReducerAction>,
  isLoggedIn: boolean
) => {
  dispatch({
    type: "SET_IS_LOGGED_IN",
    payload: {
      isLoggedIn,
    },
  });
};

export const signIn = async (
  dispatch: React.Dispatch<IAppContextReducerAction>,
  username: string,
  password: string
): Promise<CognitoUser> => {
  try {
    const signInResult = await Auth.signIn({
      username: username,
      password: password,
    });
    setIsLoggedIn(dispatch, true);
    return signInResult;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (input: {
  email: string;
  password: string;
}): Promise<CognitoUser> => {
  try {
    const signUpResult = await Auth.signUp({
      username: input.email,
      password: input.password,
    });
    return signUpResult.user;
  } catch (error) {
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////
// Hooks
//////////////////////////////////////////////////////////////////////////////////
const useLocalStorageLogin = (
  dispatch: React.Dispatch<IAppContextReducerAction>
) => {
  useEffect(() => {
    (async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsLoggedIn(dispatch, true);
      } catch (error) {
        return;
      }
    })();
  }, []);
};

const useRouteToCorrectPage = (isLoggedIn: boolean) => {
  const router = useRouter();

  useEffect(() => {
    if (
      isLoggedIn &&
      (router.pathname === "/sign_up" || router.pathname === "/sign_in")
    ) {
      router.push("/messenger");
    } else if (!isLoggedIn && router.pathname === "/messenger") {
      router.push("/sign_in");
    }
  }, [isLoggedIn, router]);
};

export const AppContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appContextReducer, initialState);
  useLocalStorageLogin(dispatch);
  useRouteToCorrectPage(state.isLoggedIn);

  return (
    <AppContext.Provider value={[state, dispatch]} children={props.children} />
  );
};
