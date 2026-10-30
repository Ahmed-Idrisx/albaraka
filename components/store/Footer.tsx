"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Clock, Download, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { settingsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useLocalized } from "@/i18n/useLocalized";
import { useInstallPrompt } from "@/features/pwa/useInstallPrompt";

const FOOTER_LINKS = [
  { href: "/products", label: "allProducts" },
  { href: "/track", label: "track" },
  { href: "/delivery-areas", label: "deliveryAreas" },
  { href: "/about", label: "about" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const localized = useLocalized();
  const { data: settings } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
  });
  const { install } = useInstallPrompt();

  const heading = "mb-4 text-sm font-bold text-brand-300";

  return (
    <footer className="mt-20 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-4 text-sm text-brand-300">{t("tagline")}</p>
        </div>

        <div>
          <h3 className={heading}>{t("links")}</h3>
          <ul className="space-y-3">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/90 hover:text-white">
                  {nav(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>{t("contact")}</h3>
          {settings && (
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings.storePhone}`}
                  className="flex items-center gap-2 text-lg text-white"
                >
                  <Phone className="size-4" />
                  <bdi dir="ltr">{settings.storePhone}</bdi>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-brand-300">
                <Clock className="size-4" />
                {localized(settings, "workingHours")}
              </li>
            </ul>
          )}
        </div>

        <div>
          <h3 className={heading}>{t("installTitle")}</h3>
          <p className="mb-4 text-sm">{t("installText")}</p>
          <button className="btn h-9" onClick={install}>
            <Download className="size-4" />
            {t("installButton")}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-sidebar-border px-4 py-5 text-center text-xs text-brand-300">
        <span>{t("rights", { year: new Date().getFullYear() })}</span>
        <span>·</span>
        <Link href="/login" className="hover:text-white">
          {nav("login")}
        </Link>
        <span>·</span>
        <LanguageSwitcher className="inline-flex items-center gap-1 text-xs font-normal hover:text-white" />
      </div>
    </footer>
  );
}
