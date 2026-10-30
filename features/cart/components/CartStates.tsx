"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, ShoppingBasket } from "lucide-react";

export function EmptyCart() {
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

export function CartSkeleton() {
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
