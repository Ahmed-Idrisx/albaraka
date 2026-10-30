import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

interface LogoProps {
  /** `light` for dark surfaces (footer, sidebar), `dark` for the white header. */
  tone?: "dark" | "light";
  className?: string;
  withTagline?: boolean;
}

/** The brand mark plus the wordmark — the same lockup the app icon and favicon are cut from. */
export function Logo({
  tone = "dark",
  className,
  withTagline = false,
}: LogoProps) {
  const t = useTranslations("brand");
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
          {t("name")}
        </span>
        {withTagline && (
          <span
            className={cn(
              "block text-xs",
              tone === "dark" ? "text-muted-foreground" : "text-brand-300",
            )}
          >
            {t("tagline")}
          </span>
        )}
      </span>
    </Link>
  );
}
