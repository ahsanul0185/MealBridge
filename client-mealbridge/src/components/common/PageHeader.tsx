import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
}

export function PageHeader({ title, subtitle, icon, action, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-dark-gray">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
}
