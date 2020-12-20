import { IAppContextState, IAppContextReducerAction } from "./types";

export default (
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
