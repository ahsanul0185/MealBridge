import type { ReactNode } from "react";

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
  const borderClass = side === "left" ? "border-r" : "border-l";

  return (
    <div
      className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${className}`}
      style={{ width: isOpen ? width : 0 }}
    >
      <div
        className={`relative h-full min-h-full bg-white ${borderClass} border-border`}
        style={{ width }}
      >
        {/* Header */}
        {(title || isOpen) && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            {title && <h2 className="text-lg font-semibold text-dark-gray">{title}</h2>}
            <button
              onClick={onClose}
              className={`rounded-lg p-1 text-text-muted hover:bg-warm-100 hover:text-dark-gray transition-colors ${title ? "" : "ml-auto"}`}
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
  );
}
