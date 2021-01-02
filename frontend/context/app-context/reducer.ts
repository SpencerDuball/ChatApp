import { IAppContextState, IAppContextReducerAction } from "./types";
import axios from "axios";

const reducer = (
  state: IAppContextState,
  action: IAppContextReducerAction
): IAppContextState => {
  switch (action.type) {
    case "SET_IS_LOGGED_IN":
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
      };

    case "SET_CREDENTIALS":
      const { credentials } = action.payload;
      return {
        ...state,
        credentials,
      };

    default: {
      throw new Error(`The action type: ${action.type} does not exist.`);
    }
  }
};

export default reducer;
