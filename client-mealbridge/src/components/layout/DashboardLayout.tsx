import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { Sidebar } from "./Sidebar";
import { UserDropdown } from "./UserDropdown";
import { LoadingSpinner } from "../common/LoadingSpinner";

export function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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
  }, []);

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    // Small delay to let React render the sidebar first (off-screen)
    // then animate it in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
  };

  const closeMobileMenu = () => {
    setIsAnimating(false);
    // Wait for animation to finish before removing from DOM
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 300);
  };

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
      {/* Desktop Sidebar - fixed left */}
      <div className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border lg:block">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop with fade animation */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobileMenu}
          />
          {/* Mobile Sidebar with slide-in animation */}
          <div
            className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-white transition-transform duration-300 ease-in-out lg:hidden ${
              isAnimating ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar user={user} onNavigate={closeMobileMenu} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-8">
          {/* Left: Mobile hamburger + Organization name */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={openMobileMenu}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Right: User Dropdown */}
          <UserDropdown user={user} />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
