import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface PublicRouteProps {
  children?: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
