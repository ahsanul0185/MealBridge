import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: "restaurant" | "ngo";
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== allowedRole) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
