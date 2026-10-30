"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, Search } from "lucide-react";
import { STORE_IMAGES } from "@/constant/images";
import { categoriesApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useLocalized } from "@/i18n/useLocalized";

export function NotFoundContent() {
  const t = useTranslations("notFound");
  const localized = useLocalized();
  const categories = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
      <div className="relative" aria-hidden>
        <p
          dir="ltr"
          className="bg-cover bg-center bg-clip-text font-display text-[8.5rem] leading-none font-extrabold text-transparent select-none sm:text-[13rem]"
          style={{ backgroundImage: `url(${STORE_IMAGES.fruits.src})` }}
        >
          404
        </p>
        <span className="plu-sticker top-1 inset-s-0 text-xs sm:top-4 sm:text-sm">
          {t("sticker")}
        </span>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
        {t("text")}
      </p>

      <form action="/products" className="mt-8 flex w-full max-w-md gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 inset-s-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="search"
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="input h-11 ps-9"
          />
        </div>
        <button className="btn h-11">{t("search")}</button>
      </form>

      {!!categories.data?.length && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.data.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="rounded-full border bg-card px-4 py-1.5 text-sm transition hover:border-primary hover:text-primary"
            >
              {localized(category, "name")}
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1 font-medium text-primary hover:underline"
      >
        {t("home")}
        <ArrowLeft className="size-4 ltr:rotate-180" />
      </Link>
    </section>
  );
}
