import { ICredentials } from "@aws-amplify/core";

// state
export interface IAppContextState {
  isLoggedIn: boolean;
  credentials: ICredentials | null;
}

// actions
export interface IAppContextReducerAction {
  type: string;
  payload: any;
}
