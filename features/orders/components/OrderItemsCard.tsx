"use client";

import { useTranslations } from "next-intl";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import type { Order } from "@/lib/types";

export function OrderItemsCard({ order: o }: { order: Order }) {
  const t = useTranslations("dashboard.order");
  const format = useFormat();
  const localized = useLocalized();

  return (
    <section className="card p-0">
      <h2 className="border-b px-6 py-4 font-bold">
        {t("items", { count: o.items.length })}
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>{t("product")}</th>
            <th>{t("quantity")}</th>
            <th>{t("unitPrice")}</th>
            <th className="text-end">{t("lineTotal")}</th>
          </tr>
        </thead>
        <tbody>
          {o.items.map((item) => (
            <tr key={item.product}>
              <td className="font-medium">{localized(item, "name")}</td>
              <td>
                {item.quantity} {localized(item, "unit")}
              </td>
              <td className="text-muted-foreground">
                {format.price(item.price)}
              </td>
              <td className="text-end font-medium">
                {format.price(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-y-2 border-t px-6 py-4 text-sm">
        <p className="flex justify-between">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{format.price(o.subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-muted-foreground">
            {t("delivery")}{" "}
            {o.deliveryArea && `(${localized(o.deliveryArea, "name")})`}
          </span>
          <span>{format.price(o.deliveryFee)}</span>
        </p>
        <p className="flex items-baseline justify-between border-t pt-3">
          <span className="font-bold">{t("total")}</span>
          <span className="font-display text-2xl font-bold text-primary">
            {format.price(o.total)}
          </span>
        </p>
      </div>
    </section>
  );
}
