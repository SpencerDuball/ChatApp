import React, { useReducer, useContext } from "react";
import authContextReducer from "./auth-context-reducer";
import { IAuthContextState, IAuthContextReducerAction } from "./auth-types";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

// create context value
const initialState: IAuthContextState = {
  cognitoUser: null,
};

// create context
export const AuthContext = React.createContext<
  [IAuthContextState, React.Dispatch<IAuthContextReducerAction>]
>(null!);
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authContextReducer, initialState);

  return (
    <AuthContext.Provider value={[state, dispatch]} children={props.children} />
  );
};

//////////////////////////////////////////////////////////////////////////////////
// Hooks
//////////////////////////////////////////////////////////////////////////////////
export const useCognitoUser = () => useContext(AuthContext)[0].cognitoUser;

//////////////////////////////////////////////////////////////////////////////////
// Dispatch Functions
//////////////////////////////////////////////////////////////////////////////////
export const setCognitoUser = (
  dispatch: React.Dispatch<IAuthContextReducerAction>,
  cognitoUser: CognitoUser
) => {
  dispatch({
    type: "SET_COGNITO_USER",
    payload: {
      cognitoUser,
    },
  });
};

export const signIn = async (
  dispatch: React.Dispatch<IAuthContextReducerAction>,
  username: string,
  password: string
) => {
  try {
    const signInResult = await Auth.signIn({
      username: username,
      password: password,
    });
    setCognitoUser(dispatch, signInResult.user);
    return signInResult;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (
  dispatch: React.Dispatch<IAuthContextReducerAction>,
  input: {
    given_name: string;
    family_name: string;
    email: string;
    password: string;
  }
) => {
  try {
    const signUpResult = await Auth.signUp({
      username: input.email,
      password: input.password,
      attributes: {
        given_name: input.given_name,
        family_name: input.family_name,
      },
    });
    setCognitoUser(dispatch, signUpResult.user);
    return signUpResult;
  } catch (error) {
    throw error;
  }
};
