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
  data: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "restaurant" | "ngo";
    address?: string;
    area: string;
    created_at?: string;
  };
}

/**
 * Register a new user (Restaurant or NGO).
 * The backend sets the token in an httpOnly cookie automatically.
 * Axios sends credentials (cookies) with every request because withCredentials: true.
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed. Please try again.";
    throw new Error(serverMessage);
  }
};

/**
 * Login an existing user.
 * The backend sets the token in an httpOnly cookie automatically.
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed. Please check your credentials and try again.";
    throw new Error(serverMessage);
  }
};

/**
 * Logout the current user.
 * The backend clears the cookie. We just call the endpoint.
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error: any) {
    const serverMessage =
      error?.response?.data?.message || error?.message || "Logout failed.";
    throw new Error(serverMessage);
  }
};

/**
 * Get the current authenticated user's profile.
 * The cookie is sent automatically by Axios with withCredentials: true.
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error: any) {
    const serverMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch profile. Please log in again.";
    throw new Error(serverMessage);
  }
};
