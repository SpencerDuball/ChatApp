import React, { useReducer, useContext } from "react";
import authContextReducer from "./auth-context-reducer";
import { IAuthContextState, IAuthContextReducerAction } from "./auth-types";
import { CognitoUser } from "amazon-cognito-identity-js";

// create context value
const initialState: IAuthContextState = {
  cognitoUser: null,
};

// create context
export const AuthContext = React.createContext<
  [IAuthContextState, React.Dispatch<IAuthContextReducerAction>]
>(null!);

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authContextReducer, initialState);

  return (
    <AuthContext.Provider value={[state, dispatch]} children={props.children} />
  );
};

// dispatch functions
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
