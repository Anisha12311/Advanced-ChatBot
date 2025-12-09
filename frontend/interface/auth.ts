export interface PASSWORD_TYPES {
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  length: boolean;
  special: boolean;
}

export interface SIGNUP {
  accessToken: string;
  message: string;
  refreshToken: string;
  user: {
    email: string;
    id: string;
    name: string;
  };
}
export interface IForm {
  name: string;
  email: string;
  password: string;
}
