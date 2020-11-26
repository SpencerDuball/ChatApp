import { CognitoUser } from "amazon-cognito-identity-js";

export interface IAuthContextState {
  cognitoUser: CognitoUser | null;
}

export interface IAuthContextReducerAction {
  type: string;
  payload: any;
}
