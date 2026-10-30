import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md";
}

/** − 1 + buttons. Never goes below 1 or above the stock. */
export function QuantityStepper({
  value,
  onChange,
  max = Infinity,
  size = "md",
}: QuantityStepperProps) {
  const t = useTranslations("common");
  const button = `flex items-center justify-center rounded-lg border bg-card transition hover:bg-secondary disabled:pointer-events-none disabled:opacity-40 ${
    size === "sm" ? "size-8" : "size-11"
  }`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={button}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={t("increase")}
      >
        <Plus className="size-4" />
      </button>
      <span
        className={`text-center font-display font-bold tabular-nums ${
          size === "sm" ? "w-6" : "w-8 text-lg"
        }`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={t("decrease")}
      >
        <Minus className="size-4" />
      </button>
    </div>
  );
}
