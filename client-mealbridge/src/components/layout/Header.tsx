import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { UserDropdown } from "./UserDropdown";

export function Header() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isLoginPage || isRegisterPage) {
      return;
    }

    getProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, [isLoginPage, isRegisterPage, location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const mobileMenuBaseClass =
    "overflow-hidden border-t border-border bg-white transition-all duration-300 ease-in-out md:hidden";
  const mobileMenuStateClass =
    isMobileMenuOpen && !isAuthenticated
      ? "max-h-96 opacity-100"
      : "max-h-0 opacity-0";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo-mealbridge.png"
            alt="MealBridge"
            className="h-10 object-contain sm:h-12"
          />
        </Link>

        {/* Desktop Nav Links - shown on landing page */}
        {!isAuthenticated && !isLoginPage && !isRegisterPage && (
          <div className="hidden items-center gap-6 md:flex">
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Not authenticated — show auth buttons */}
          {!isAuthenticated && (
            <>
              {/* Desktop auth actions */}
              <div className="hidden items-center gap-3 md:flex">
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
              </div>

              {/* Mobile: hamburger menu button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-gray-50 hover:text-dark-gray md:hidden"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}

          {/* Authenticated — show user dropdown */}
          {isAuthenticated && user && <UserDropdown user={user} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${mobileMenuBaseClass} ${mobileMenuStateClass}`}>
        <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
          {/* Nav Links */}
          {!isLoginPage && !isRegisterPage && (
            <>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
              >
                How It Works
              </Link>
            </>
          )}

          {/* Auth Actions */}
          {isRegisterPage && (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="block rounded-lg border-2 border-primary px-3 py-2.5 text-center text-base font-medium text-primary transition-colors hover:bg-primary-50"
            >
              Sign In
            </Link>
          )}
          {isLoginPage && (
            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="block rounded-lg border-2 border-primary px-3 py-2.5 text-center text-base font-medium text-primary transition-colors hover:bg-primary-50"
            >
              Create Account
            </Link>
          )}
          {!isLoginPage && !isRegisterPage && (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2.5 text-center text-base font-medium text-text-secondary transition-colors hover:bg-gray-50 hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="block rounded-lg bg-primary px-3 py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
