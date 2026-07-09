import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { login as loginService, register as registerService, getProfile } from "../services/auth.service";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "restaurant" | "ngo";
    address: string;
    area: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // Not logged in — cookie missing or expired
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginService({ email, password });
    setUser(result.data.user);
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "restaurant" | "ngo";
    address: string;
    area: string;
  }) => {
    const result = await registerService(data);
    setUser(result.data.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
