import React, { useReducer, useContext, Dispatch } from "react";
import { AppContext } from "context/app-context/context";
import {
  MessengerContextStateI,
  MessengerContextReducerActionI,
} from "./types";
import reducer from "./reducer";
import { useQuery } from "react-query";
import { ApiErrorResponseI, ApiSuccessResponseI, ContactI } from "api/types";
import { API } from "api/API";

// create context value
const initialState: MessengerContextStateI = {
  contacts: null,
  selectedContact: null,
  selectedView: "CHAT",
};

// create context
export const MessengerContext = React.createContext<
  [MessengerContextStateI, React.Dispatch<MessengerContextReducerActionI>]
>(null!);
MessengerContext.displayName = "MessengerContext";

//////////////////////////////////////////////////////////////////////////////
// dispatch actions
//////////////////////////////////////////////////////////////////////////////
export const setContacts = (
  dispatch: Dispatch<MessengerContextReducerActionI>,
  contacts: ContactI[]
) =>
  dispatch({
    type: "SET_CONTACTS",
    payload: {
      contacts,
    },
  });

export const setSelectedContact = (
  dispatch: Dispatch<MessengerContextReducerActionI>,
  contact: ContactI
) =>
  dispatch({
    type: "SET_SELECTED_CONTACT",
    payload: { selectedContact: contact },
  });

export const setSelectedView = (
  dispatch: Dispatch<MessengerContextReducerActionI>,
  view: "CHAT" | "CONTACT"
) => dispatch({ type: "SET_SELECTED_VIEW", payload: { selectedView: view } });

// provider
export const MessengerContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [appContext] = useContext(AppContext);

  // populate contacts
  useQuery<ApiSuccessResponseI<ContactI>, ApiErrorResponseI>(
    "contacts",
    async () => {
      const res = await API.get("/test/contacts");
      setContacts(dispatch, res.data.body);
      return res.data;
    },
    { enabled: !!appContext.credentials }
  );

  return (
    <MessengerContext.Provider
      value={[state, dispatch]}
      children={props.children}
    />
  );
};
