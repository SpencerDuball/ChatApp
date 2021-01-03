import { QueryObserverResult } from "react-query";

// contact request types
export interface ContactErrorResponseI {
  status: number;
  data: {
    code: string;
    message: string;
  };
}
export interface ContactSuccessResponseI<T> {
  status: number;
  data: T;
}

// contact data types
export interface ContactI {
  id: string;
  givenName: string;
  familyName: string;
  profilePhotoUrl: string;
  notes: string;
}

// messenger context types
export interface MessengerContextStateI {
  contacts: QueryObserverResult<
    ContactSuccessResponseI<ContactI[]>,
    ContactErrorResponseI
  >;
}
export interface MessengerContextReducerActionI {
  type: string;
  payload: any;
}
