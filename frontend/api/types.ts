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
