"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Clock, Phone, Truck } from "lucide-react";
import { deliveryAreasApi, settingsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useLocalized } from "@/i18n/useLocalized";

/** Phone, working hours and delivery coverage — shared by the info pages. */
export function ContactCard() {
  const t = useTranslations("contact");
  const localized = useLocalized();
  const settings = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
  });
  const areas = useQuery({
    queryKey: queryKeys.deliveryAreas(true),
    queryFn: () => deliveryAreasApi.list(true),
  });

  const items = [
    {
      icon: Phone,
      label: t("phone"),
      value: settings.data && (
        <a href={`tel:${settings.data.storePhone}`}>
          <bdi dir="ltr">{settings.data.storePhone}</bdi>
        </a>
      ),
    },
    {
      icon: Clock,
      label: t("hours"),
      value: settings.data && localized(settings.data, "workingHours"),
    },
    {
      icon: Truck,
      label: t("delivery"),
      value: areas.data && t("areaCount", { count: areas.data.length }),
      note: t("deliveryNote"),
    },
  ];

  return (
    <section className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("title")}</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, note }) => (
          <div key={label}>
            <p className="mb-1 flex items-center gap-2 text-sm text-brand-300">
              <Icon className="size-4" />
              {label}
            </p>
            <p className="font-medium text-white">{value ?? "…"}</p>
            {note && <p className="mt-0.5 text-xs text-brand-300">{note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
