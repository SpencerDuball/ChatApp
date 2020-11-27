// state
export interface IAppContextState {
  isLoggedIn: boolean;
}

// actions
export interface IAppContextReducerAction {
  type: string;
  payload: any;
}
