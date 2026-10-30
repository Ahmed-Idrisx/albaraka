"use client";

import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { BrandMark } from "@/components/shared/BrandMark";
import { useInstallPrompt } from "@/features/pwa/useInstallPrompt";

/** Shown only once the browser says the site can be installed. */
export function InstallAppBanner() {
  const t = useTranslations("install");
  const common = useTranslations("common");
  const { canInstall, install, dismiss } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <section className="card flex items-center gap-4">
      <BrandMark className="size-12 shrink-0" />
      <div className="flex-1">
        <p className="font-bold">{t("bannerTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("bannerText")}</p>
      </div>
      <button className="btn" onClick={install}>
        <Download className="size-4" />
        {t("button")}
      </button>
      <button className="btn-ghost" onClick={dismiss} aria-label={common("close")}>
        <X className="size-4" />
      </button>
    </section>
  );
}
