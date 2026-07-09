import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "../../hooks/useClickOutside";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({ trigger, items, align = "right", className = "" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const menuWidth = 176; // w-44
      const gap = 4;

      let left = align === "right" ? rect.right - menuWidth : rect.left;
      const top = rect.bottom + gap;

      // Prevent going off-screen on the right
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }
      // Prevent going off-screen on the left
      if (left < 8) {
        left = 8;
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, align]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-warm-50 hover:text-dark-gray transition-colors ${className}`}
      >
        {trigger}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 w-44 rounded-lg border border-border bg-white py-1 shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-text-secondary hover:bg-warm-50 hover:text-dark-gray"
                }`}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
