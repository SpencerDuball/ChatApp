import * as React from "react";
import { useInitiateAuth } from "./authHooks";

// define the context
interface IAuthContext {}
const initialAuthContext = {};

//////////////////////////////////////////////////////////////////////////////
// Create the actions for the AuthContextReducer
export interface IAuthContextAction {
  type: string;
  payload: any;
}
//////////////////////////////////////////////////////////////////////////////

// create the reducer
const authContextReducer = (
  state: IAuthContext,
  action: IAuthContextAction
) => {
  switch (action.type) {
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
      return state;
    }
  }
};

export const AuthContext = React.createContext<IAuthContext>(
  initialAuthContext
);

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(
    authContextReducer,
    initialAuthContext
  );
  useInitiateAuth(dispatch);

  return <AuthContext.Provider value={{}} {...props} />;
};
