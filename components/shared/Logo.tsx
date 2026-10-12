import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

interface LogoProps {
  /** `light` for dark surfaces (footer, sidebar), `dark` for the white header. */
  tone?: "dark" | "light";
  className?: string;
  withTagline?: boolean;
}

/** The ب mark plus the wordmark — the same lockup the app icon and favicon are cut from. */
export function Logo({
  tone = "dark",
  className,
  withTagline = false,
}: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <BrandMark tone={tone} className="size-9" />
      <span className="leading-tight">
        <span
          className={cn(
            "block font-display text-lg font-extrabold",
            tone === "dark" ? "text-brand-900" : "text-white",
          )}
        >
          البركة
        </span>
        {withTagline && (
          <span
            className={cn(
              "block text-xs",
              tone === "dark" ? "text-muted-foreground" : "text-brand-300",
            )}
          >
            خضار وفاكهة طازجة
          </span>
        )}
      </span>
    </Link>
  );
}
