import {
  MessengerContextStateI,
  MessengerContextReducerActionI,
} from "./types";

const reducer = (
  state: MessengerContextStateI,
  action: MessengerContextReducerActionI
): MessengerContextStateI => {
  switch (action.type) {
    case "SET_CONTACTS":
      return {
        ...state,
        contacts: action.payload.contacts,
      };

    case "SET_SELECTED_CONTACT":
      return {
        ...state,
        selectedContact: action.payload.selectedContact,
      };

    case "SET_SELECTED_VIEW":
      return {
        ...state,
        selectedView: action.payload.selectedView,
      };

    default: {
      throw new Error(`The action type: ${action.type} does not exist.`);
    }
  }
};

export default reducer;
