// contact request types
export interface ApiErrorResponseI {
  status: number;
  data: {
    code: string;
    message: string;
  };
}
export interface ApiSuccessResponseI<T> {
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
