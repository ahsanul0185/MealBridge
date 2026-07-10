import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      labelClassName,
      error,
      helperText,
      options,
      placeholder,
      leftIcon,
      fullWidth = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? "w-full" : "";
    const errorClass = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-border focus:border-primary focus:ring-primary/20";

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className={`mb-1.5 block ${labelClassName || "text-sm font-medium text-dark-gray"}`}>
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            className={`focus-ring block w-full appearance-none rounded-lg border bg-white py-2.5 text-sm text-dark-gray ${
              leftIcon ? "pl-10" : "pl-3"
            } pr-10 ${errorClass}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
