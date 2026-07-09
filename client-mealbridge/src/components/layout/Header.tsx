import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { UserDropdown } from "./UserDropdown";

export function Header() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isLoginPage || isRegisterPage) {
      setIsLoading(false);
      return;
    }

    getProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [isLoginPage, isRegisterPage, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo-mealbridge.png"
            alt="MealBridge"
            className="h-12 object-contain"
          />
        </Link>

        {/* Nav Links - shown on landing page */}
        {!isAuthenticated && !isLoginPage && !isRegisterPage && (
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
            >
              How It Works
            </Link>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Not authenticated — show auth buttons */}
          {!isAuthenticated && (
            <>
              {isRegisterPage && (
                <>
                  <span className="text-sm text-text-secondary">Already registered?</span>
                  <Link
                    to="/login"
                    className="rounded-lg border-2 border-primary px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Sign In
                  </Link>
                </>
              )}
              {isLoginPage && (
                <>
                  <span className="text-sm text-text-secondary">New here?</span>
                  <Link
                    to="/register"
                    className="rounded-lg border-2 border-primary px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    Create Account
                  </Link>
                </>
              )}
              {!isLoginPage && !isRegisterPage && (
                <>
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}

          {/* Authenticated — show user dropdown */}
          {isAuthenticated && user && (
            <UserDropdown user={user} />
          )}
        </div>
      </div>
    </nav>
  );
}
