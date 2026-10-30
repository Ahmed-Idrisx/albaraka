"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Wallet } from "lucide-react";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import type { DeliveryArea, ValidatedCart } from "@/lib/types";

interface CheckoutSummaryProps {
  cart?: ValidatedCart;
  selectedArea?: DeliveryArea;
  needsArea: boolean;
}

export function CheckoutSummary({
  cart,
  selectedArea,
  needsArea,
}: CheckoutSummaryProps) {
  const t = useTranslations("checkout");
  const format = useFormat();
  const localized = useLocalized();

  return (
    <aside className="card space-y-4 p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">{t("summary")}</h2>

      <ul className="max-h-60 space-y-2 overflow-y-auto text-sm">
        {cart?.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              {localized(item, "name")} × {item.quantity}
            </span>
            <span className="shrink-0">
              {item.lineTotal != null && format.price(item.lineTotal)}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t pt-4 text-sm">
        <p className="flex justify-between">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{cart && format.price(cart.subtotal)}</span>
        </p>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t("delivery")}
            {selectedArea && (
              <span className="block text-xs">
                {localized(selectedArea, "name")}
              </span>
            )}
          </span>
          <span>
            {selectedArea || !needsArea
              ? cart && format.price(cart.deliveryFee)
              : t("chooseArea")}
          </span>
        </div>
      </div>

      <p className="flex items-baseline justify-between border-t pt-4">
        <span className="font-bold">{t("total")}</span>
        <span className="font-display text-2xl font-bold text-primary">
          {cart && format.price(cart.total)}
        </span>
      </p>

      <p className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
        <Wallet className="size-4" />
        {t("paymentMethod")}
      </p>

      <Link
        href="/cart"
        className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4 ltr:rotate-180" />
        {t("editCart")}
      </Link>
    </aside>
  );
}
