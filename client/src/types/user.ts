export interface User {
  id: string;
  email: string;
  displayName: string;
  token: string;
  imageUrl: string;
}

export interface LoginCreds {
  email: string;
  password: string;
}

export interface RegisterCreds {
  email: string;
  displayName: string;
  password: string;
}
