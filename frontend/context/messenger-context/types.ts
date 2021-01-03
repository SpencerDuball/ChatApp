import { ContactI } from "api/types";

// messenger context types
export interface MessengerContextStateI {
  contacts: ContactI[] | null;
  selectedContact: ContactI | null;
  selectedView: "CHAT" | "CONTACT";
}
export interface MessengerContextReducerActionI {
  type: string;
  payload: any;
}
