import api from "./axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "restaurant" | "ngo";
  address?: string;
  area: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterData) => api.post("/auth/register", data),
  login: (data: LoginData) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};
