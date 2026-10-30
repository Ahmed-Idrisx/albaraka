"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertCircle, Trash2 } from "lucide-react";
import type { ValidatedCartItem } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useCart } from "@/store/cart";
import { QuantityStepper } from "@/components/store/QuantityStepper";

export function CartItem({ item }: { item: ValidatedCartItem }) {
  const t = useTranslations("cart");
  const issues = useTranslations("cartIssues");
  const format = useFormat();
  const localized = useLocalized();
  const { setQuantity, remove } = useCart();
  const name = item.name ? localized(item, "name") : t("removedProduct");

  return (
    <li
      className={`flex gap-4 rounded-2xl border bg-card p-4 ${
        item.issue ? "border-destructive/50" : ""
      }`}
    >
      <Link
        href={item.slug ? `/products/${item.slug}` : "#"}
        className="photo-frame relative size-24 shrink-0 overflow-hidden rounded-xl"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={name}
            fill
            sizes="96px"
            className="object-contain p-1"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold">
            {name}
          </p>
          {item.price != null && (
            <p className="text-sm text-muted-foreground">
              {t("unitPrice", {
                price: format.price(item.price),
                unit: localized(item, "unit"),
              })}
            </p>
          )}
          {item.issue && (
            <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="size-4" />
              {issues(item.issue, { count: item.stock ?? 0 })}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          {item.name && (
            <QuantityStepper
              size="sm"
              value={item.quantity}
              onChange={(q) => setQuantity(item.productId, q)}
            />
          )}
          <p className="w-24 text-end font-display text-lg font-bold text-primary">
            {item.lineTotal != null && format.price(item.lineTotal)}
          </p>
        </div>
      </div>

      <button
        onClick={() => remove(item.productId)}
        className="self-start rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        aria-label={t("removeItem", { name: name })}
        title={t("remove")}
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
