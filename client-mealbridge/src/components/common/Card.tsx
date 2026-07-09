import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md";
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const shadowStyles = {
  none: "",
  sm: "shadow-[var(--shadow-card)]",
  md: "shadow-[var(--shadow-card-hover)]",
};

export function Card({
  children,
  className = "",
  padding = "md",
  shadow = "sm",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-border ${paddingStyles[padding]} ${shadowStyles[shadow]} ${
        hover ? "card-hover cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Stat Card - used in dashboards
interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  onClick?: () => void;
}

export function StatCard({
  icon,
  iconBg,
  label,
  value,
  sublabel,
  onClick,
}: StatCardProps) {
  return (
    <Card
      padding="md"
      shadow="sm"
      hover={!!onClick}
      onClick={onClick}
      className="animate-fade-in"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-1 text-2xl font-bold text-dark-gray">{value}</p>
          {sublabel && (
            <p className="mt-0.5 text-xs text-text-muted">{sublabel}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
