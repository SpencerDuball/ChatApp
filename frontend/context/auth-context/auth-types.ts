import { CognitoUser } from "amazon-cognito-identity-js";

// state
export interface IAuthContextState {
  cognitoUser: CognitoUser | null;
}

// actions
export interface IAuthContextReducerAction {
  type: string;
  payload: any;
}
