import { ICredentials } from "@aws-amplify/core";
import { AxiosInstance } from "axios";

// state
export interface IAppContextState {
  isLoggedIn: boolean;
  API: AxiosInstance | null;
  credentials: ICredentials | null;
}

// actions
export interface IAppContextReducerAction {
  type: string;
  payload: any;
}
