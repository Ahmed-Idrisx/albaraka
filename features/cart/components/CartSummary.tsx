"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useFormat } from "@/i18n/useFormat";

interface CartSummaryProps {
  subtotal: number;
  canCheckout: boolean;
}

export function CartSummary({ subtotal, canCheckout }: CartSummaryProps) {
  const t = useTranslations("cart");
  const format = useFormat();

  return (
    <aside className="card space-y-4 p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">{t("summary")}</h2>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{format.price(subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-muted-foreground">{t("delivery")}</span>
          <span className="text-muted-foreground">{t("byArea")}</span>
        </p>
      </div>
      <p className="flex items-baseline justify-between border-t pt-4">
        <span className="font-bold">{t("total")}</span>
        <span className="font-display text-2xl font-bold text-primary">
          {format.price(subtotal)}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">{t("deliveryHint")}</p>

      {canCheckout ? (
        <Link href="/checkout" className="btn h-11 w-full">
          {t("checkout")}
          <ArrowLeft className="size-4 ltr:rotate-180" />
        </Link>
      ) : (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {t("fixItems")}
        </p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        {t("cashOnDelivery")}
      </p>
    </aside>
  );
}
