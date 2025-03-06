export interface ISignupPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    store_name: string;
  }

export interface ILoginPayload {
    email: string;
    password: string;
  }
  