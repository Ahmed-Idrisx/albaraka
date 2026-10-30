import type { ReactNode } from "react";

interface FormFieldProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  /** Grey help text; replaced by the error when there is one. */
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Label, required star, hint and error message around one input. */
export function FormField({
  htmlFor,
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
