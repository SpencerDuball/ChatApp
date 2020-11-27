import { IAuthContextState, IAuthContextReducerAction } from "./auth-types";

const authContextReducer = (
  state: IAuthContextState,
  action: IAuthContextReducerAction
): IAuthContextState => {
  switch (action.type) {
    case "SET_COGNITO_USER": {
      // save the cognito user to localStorage
      if (window && window.localStorage) {
        window.localStorage.setItem(
          "cognitoUser",
          JSON.stringify(action.payload.cognitoUser)
        );
      }

      // save the new cognito user to context
      return {
        ...state,
        cognitoUser: action.payload.cognitoUser,
      };
    }

    default: {
      throw new Error(`The action type: ${action.type} does not exist.`);
    }
  }
};

export default authContextReducer;
