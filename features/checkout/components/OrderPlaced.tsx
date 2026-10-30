"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircle2, Download, PackageSearch } from "lucide-react";
import { useInstallPrompt } from "@/features/pwa/useInstallPrompt";

export function OrderPlaced({ orderNumber }: { orderNumber: string }) {
  const t = useTranslations("checkout.placed");
  const install = useTranslations("install");
  const { install: installApp } = useInstallPrompt();

  return (
    <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center sm:p-10">
      <CheckCircle2
        className="mx-auto mb-5 size-16 text-primary"
        strokeWidth={1.5}
      />
      <h1 className="text-3xl font-extrabold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("text")}</p>

      <p className="mt-10 text-sm text-muted-foreground">{t("orderNumber")}</p>
      <p className="mt-2 font-mono text-2xl font-bold tracking-wider" dir="ltr">
        {orderNumber}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{t("keepNumber")}</p>

      <Link
        href={`/track?order=${orderNumber}`}
        className="btn mt-10 h-11 w-full"
      >
        <PackageSearch className="size-4" />
        {t("track")}
      </Link>
      <Link
        href="/products"
        className="mt-4 inline-block font-medium hover:text-primary"
      >
        {t("orderMore")}
      </Link>

      <div className="mt-8 border-t pt-6 text-start">
        <p className="font-bold">{install("title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {install("afterOrderText")}
        </p>
        <button className="btn mt-4 h-9" onClick={installApp}>
          <Download className="size-4" />
          {install("buttonLong")}
        </button>
      </div>
    </div>
  );
}
