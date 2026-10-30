"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { setLocale } from "@/i18n/actions";
import { cn } from "@/lib/utils";

/** Switches between Arabic and English; the whole page re-renders in the new language. */
export function LanguageSwitcher({ className = "btn-ghost w-auto px-2.5" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      // The caller's classes win over the defaults (twMerge resolves the clash).
      className={cn("gap-1.5 text-sm font-medium", className)}
      disabled={pending}
      aria-label={t("switchLanguage")}
      title={t("switchLanguage")}
      onClick={() =>
        startTransition(async () => {
          await setLocale(next);
          router.refresh();
        })
      }
    >
      <Languages className="size-4" />
      {/* Each language is named in itself, so either reader can find theirs. */}
      <span lang={next}>{next === "en" ? "English" : "العربية"}</span>
    </button>
  );
}
