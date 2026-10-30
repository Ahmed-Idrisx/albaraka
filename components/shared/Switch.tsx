import type { ReactNode } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  /** Small grey line under the label. */
  description?: ReactNode;
  disabled?: boolean;
  /** Submits "true"/"false" with a plain <form> under this name. */
  name?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  name,
}: SwitchProps) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {name && <input type="hidden" name={name} value={String(checked)} />}
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-muted transition peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40 after:absolute after:top-0.5 after:start-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:start-5.5" />
    </label>
  );
}
