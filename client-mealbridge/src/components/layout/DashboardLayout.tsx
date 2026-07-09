import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { Sidebar } from "./Sidebar";
import { UserDropdown } from "./UserDropdown";
import { LoadingSpinner } from "../common/LoadingSpinner";

export function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
        navigate("/login", { replace: true });
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
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - persists across navigation */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-border bg-white px-8">
          {/* Right: User Dropdown */}
          <UserDropdown user={user} />
        </header>

        {/* Page Content - changes via Outlet */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
