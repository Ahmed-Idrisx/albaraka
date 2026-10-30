"use client";

import { MapPin, MessageSquareText, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocalized } from "@/i18n/useLocalized";
import type { Order } from "@/lib/types";

export function OrderCustomerCard({ order: o }: { order: Order }) {
  const t = useTranslations("dashboard.order");
  const localized = useLocalized();

  return (
    <section className="card space-y-4 p-6 text-sm">
      <h2 className="font-bold">{t("customer")}</h2>
      <p className="flex items-center gap-3">
        <User className="size-4 shrink-0 text-muted-foreground" />
        {o.customer.name}
      </p>
      <p className="flex items-center gap-3">
        <Phone className="size-4 shrink-0 text-muted-foreground" />
        <a
          href={`tel:${o.customer.phone}`}
          className="font-medium text-primary hover:underline"
        >
          <bdi>{o.customer.phone}</bdi>
        </a>
      </p>
      <p className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <span>
          {o.deliveryArea && (
            <span className="block font-medium">
              {localized(o.deliveryArea, "name")}
            </span>
          )}
          <bdi>{o.customer.address}</bdi>
        </span>
      </p>
      {o.customer.notes && (
        <p className="flex items-start gap-3 rounded-lg bg-secondary p-3 text-secondary-foreground">
          <MessageSquareText className="mt-0.5 size-4 shrink-0" />
          {o.customer.notes}
        </p>
      )}
      <a href={`tel:${o.customer.phone}`} className="btn-outline w-full">
        <Phone className="size-4" />
        {t("call")}
      </a>
    </section>
  );
}
