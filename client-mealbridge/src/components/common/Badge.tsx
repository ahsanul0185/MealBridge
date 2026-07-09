import type { FoodStatus } from "../../types/food";
import type { PickupStatus } from "../../types/claim";

const statusConfig: Record<
  FoodStatus | PickupStatus | string,
  { bg: string; text: string; label: string }
> = {
  Available: { bg: "bg-status-available-bg", text: "text-status-available-text", label: "Available" },
  Claimed: { bg: "bg-status-claimed-bg", text: "text-status-claimed-text", label: "Claimed" },
  "On the way": { bg: "bg-status-ontheway-bg", text: "text-status-ontheway-text", label: "On the Way" },
  "Picked up": { bg: "bg-status-pickedup-bg", text: "text-status-pickedup-text", label: "Picked Up" },
  Expired: { bg: "bg-status-expired-bg", text: "text-status-expired-text", label: "Expired" },
  Cancelled: { bg: "bg-status-cancelled-bg", text: "text-status-cancelled-text", label: "Cancelled" },
};

interface StatusBadgeProps {
  status: FoodStatus | PickupStatus | string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "sm", className = "" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: status,
  };

  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`status-badge ${config.bg} ${config.text} ${sizeClasses} ${className}`}
    >
      {config.label}
    </span>
  );
}

// Food Type Badge (Veg / Non-Veg)
interface FoodTypeBadgeProps {
  type: "Veg" | "Non-Veg";
  size?: "sm" | "md";
  className?: string;
}

export function FoodTypeBadge({ type, size = "sm", className = "" }: FoodTypeBadgeProps) {
  const isVeg = type === "Veg";
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${
        isVeg ? "food-type-veg" : "food-type-nonveg"
      } ${className}`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          isVeg ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {type}
    </span>
  );
}

// Generic Badge
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "danger" | "warning" | "success";
  size?: "sm" | "md";
  className?: string;
}

const badgeVariants = {
  default: "bg-warm-100 text-text-secondary border-border",
  primary: "bg-primary-50 text-primary border-primary-200",
  accent: "bg-accent-50 text-accent border-accent-100",
  danger: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

export function Badge({ children, variant = "default", size = "sm", className = "" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
