export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "restaurant" | "ngo";
  address?: string;
  area: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "restaurant" | "ngo";
  address?: string;
  area: string;
}
