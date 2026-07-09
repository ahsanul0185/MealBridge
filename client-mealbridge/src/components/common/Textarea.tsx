import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      fullWidth = true,
      rows = 4,
      className = "",
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? "w-full" : "";
    const errorClass = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-border focus:border-primary focus:ring-primary/20";

    const currentLength = props.value?.toString().length || 0;

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-dark-gray">
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          className={`focus-ring block rounded-lg border bg-white p-3 text-sm text-dark-gray placeholder:text-text-muted resize-y ${errorClass}`}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : helperText ? (
            <p className="text-xs text-text-muted">{helperText}</p>
          ) : (
            <div />
          )}
          {maxLength && (
            <p className="text-xs text-text-muted">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
