import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
  width?: string;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = "left",
  width = "420px",
  className = "",
}: DrawerProps) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const borderClass = side === "left" ? "border-r lg:border-l-0" : "border-l lg:border-r-0";
  const outerWidth = isDesktop ? (isOpen ? width : "0px") : width;
  const innerWidth = isDesktop ? width : "100%";

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`
          fixed inset-y-0 ${side === "left" ? "left-0" : "right-0"} z-50 h-full max-w-[calc(100vw-3rem)]
          overflow-hidden transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:max-w-none lg:shrink-0 lg:transition-[width] lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : side === "left" ? "-translate-x-full shadow-none" : "translate-x-full shadow-none"}
          ${className}
        `}
        style={{ width: outerWidth }}
      >
        <div
          className={`relative flex h-full min-h-full flex-col bg-white ${borderClass} border-border`}
          style={{ width: innerWidth }}
        >
          {/* Header */}
          {(title || isOpen) && (
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              {title && <h2 className="text-lg font-semibold text-dark-gray">{title}</h2>}
              <button
                onClick={onClose}
                className={`rounded-lg p-1 text-text-muted hover:bg-warm-100 hover:text-dark-gray transition-colors ${
                  title ? "" : "ml-auto"
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="h-[calc(100%-65px)] overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
