"use client";

import Image from "next/image";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowLeft, ShoppingBasket, Trash2 } from "lucide-react";
import { cartApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import type { ValidatedCartItem } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "@/store/cart";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { ErrorState } from "@/components/shared/States";
import { PageHeader } from "@/components/shared/PageHeader";
import { QuantityStepper } from "@/components/store/QuantityStepper";

export default function CartPage() {
  const t = useTranslations("cart");
  const issues = useTranslations("cartIssues");
  const format = useFormat();
  const localized = useLocalized();
  const mounted = useMounted();
  const { lines, setQuantity, remove, clear } = useCart();

  const cart = useQuery({
    queryKey: queryKeys.cart(lines),
    queryFn: () => cartApi.validate(lines),
    enabled: lines.length > 0,
    placeholderData: keepPreviousData,
  });

  if (!mounted || (lines.length > 0 && cart.isPending)) return <CartSkeleton />;
  if (lines.length === 0) return <EmptyCart />;
  if (cart.error) return <ErrorState error={cart.error} />;

  const { items, subtotal, canCheckout } = cart.data!;
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const nameOf = (item: ValidatedCartItem) =>
    item.name ? localized(item, "name") : t("removedProduct");

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        description={t("itemCount", { count })}
        action={
          <ConfirmButton onConfirm={clear} confirmLabel={t("confirmClear")}>
            {t("clear")}
          </ConfirmButton>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.productId}
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
                    alt={nameOf(item)}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold">
                    {nameOf(item)}
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
                aria-label={t("removeItem", { name: nameOf(item) })}
                title={t("remove")}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

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
      </div>
    </div>
  );
}

function EmptyCart() {
  const t = useTranslations("cart");
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-secondary text-primary">
        <ShoppingBasket className="size-9" />
      </span>
      <h1 className="text-2xl font-extrabold">{t("emptyTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("emptyText")}</p>
      <Link href="/products" className="btn mt-6">
        {t("startShopping")}
        <ArrowLeft className="size-4 ltr:rotate-180" />
      </Link>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 pt-20 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-muted" />
    </div>
  );
}
