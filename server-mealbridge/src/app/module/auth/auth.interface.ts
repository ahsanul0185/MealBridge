export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "restaurant" | "ngo";
  address?: string;
  area: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}
