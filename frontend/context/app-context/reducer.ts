import { IAppContextState, IAppContextReducerAction } from "./types";
import { Auth } from "aws-amplify";

const idTokenKey = (sub: string) =>
  `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}.${sub}.idToken`;

const reducer = (
  state: IAppContextState,
  action: IAppContextReducerAction
): IAppContextState => {
  switch (action.type) {
    case "SET_IS_LOGGED_IN": {
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
      };
    }

    default: {
      throw new Error(`The action type: ${action.type} does not exist.`);
    }
  }
};

export default reducer;
