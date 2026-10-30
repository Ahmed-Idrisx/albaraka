"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** Extra text on the end side of the row, e.g. a delivery price. */
  hint?: ReactNode;
}

interface SelectProps<T extends string> {
  value: T | "";
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  icon?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  /** Submits the value with a plain <form> under this name. */
  name?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

/**
 * A themed dropdown (the browser's own <select> list can't be styled).
 * Works with the mouse and keyboard: arrows to move, Enter to pick, Esc to close.
 */
export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  icon,
  invalid,
  disabled,
  name,
  id,
  className = "",
  ...aria
}: SelectProps<T>) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  // Close when clicking anywhere else on the page.
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const pick = (option: SelectOption<T>) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (options[active]) pick(options[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        disabled={disabled}
        {...aria}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`input flex items-center gap-2 text-start ${
          open ? "border-ring ring-3 ring-ring/25" : ""
        } ${invalid ? "border-destructive" : ""} disabled:opacity-60`}
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span
          className={`flex-1 truncate ${selected ? "" : "text-muted-foreground"}`}
        >
          {selected?.label ?? placeholder ?? t("choose")}
        </span>
        {selected?.hint && (
          <span className="text-xs text-muted-foreground">{selected.hint}</span>
        )}
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border bg-card p-1.5 shadow-card-hover"
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(option)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  i === active ? "bg-secondary" : ""
                } ${isSelected ? "font-medium text-primary" : ""}`}
              >
                <Check
                  className={`size-4 shrink-0 ${isSelected ? "" : "invisible"}`}
                />
                <span className="flex-1">{option.label}</span>
                {option.hint && (
                  <span className="text-xs text-muted-foreground">
                    {option.hint}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
