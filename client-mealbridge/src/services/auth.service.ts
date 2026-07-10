import api from "../lib/axios";

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

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "restaurant" | "ngo";
  phone?: string;
  address?: string;
  area: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: "restaurant" | "ngo";
    };
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data: null;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<MessageResponse> => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (
  token: string,
  data: ResetPasswordData
): Promise<MessageResponse> => {
  const response = await api.post(`/auth/reset-password/${token}`, data);
  return response.data;
};
