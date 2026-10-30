import { cn } from "@/lib/utils";

const BOWL = "M 18 30 C 18 52, 25 60, 37 60 L 65 60 C 77 60, 84 52, 84 24";
const STROKE = 13;
const DOT = { cx: 51, cy: 82, r: 8.5 };

const BOX = { x: 11.5, y: 17.5, w: 79, h: 73 };

interface BrandMarkProps {
  tone?: "dark" | "light";
  className?: string;
}

export function BrandMark({ tone = "dark", className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full",
        tone === "dark" ? "bg-primary" : "bg-white",
        className,
      )}
    >
      <svg
        viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
        className="h-[52%] w-[64%] overflow-visible"
        aria-hidden
      >
        <path
          d={BOWL}
          fill="none"
          stroke={
            tone === "dark" ? "var(--primary-foreground)" : "var(--sidebar)"
          }
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={DOT.cx}
          cy={DOT.cy}
          r={DOT.r}
          fill="var(--color-fruit-lemon)"
        />
      </svg>
    </span>
  );
}
