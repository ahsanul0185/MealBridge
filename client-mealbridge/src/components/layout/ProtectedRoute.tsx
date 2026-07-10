import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface ProtectedRouteProps {
  allowedRole?: "restaurant" | "ngo";
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []); // Only fetch once on mount

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // If children prop is provided, render it (for layout wrapper)
  // Otherwise render Outlet (for direct route element)
  return children ? <>{children}</> : <Outlet />;
}
