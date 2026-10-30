"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { HomeSection } from "@/lib/types";
import { useLocalized } from "@/i18n/useLocalized";
import { ProductCard } from "@/components/store/ProductCard";

/** One row per category: its newest products, scrolling sideways. */
export function CategorySections({ sections }: { sections: HomeSection[] }) {
  return (
    <div className="space-y-14">
      {sections.map((section) => (
        <CategoryRow key={section.category.id} section={section} />
      ))}
    </div>
  );
}

function CategoryRow({ section }: { section: HomeSection }) {
  const t = useTranslations("home.sections");
  const common = useTranslations("common");
  const locale = useLocale();
  const localized = useLocalized();
  const { category, products, availableCount } = section;
  const categoryName = localized(category, "name");

  const rowRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Right-to-left rows report scrollLeft as 0 → negative, left-to-right as 0 → positive,
  // so only the distance (Math.abs) is compared.
  const updateArrows = () => {
    const row = rowRef.current;
    if (!row) return;
    const scrolled = Math.abs(row.scrollLeft);
    setCanGoBack(scrolled > 4);
    setCanGoForward(scrolled + row.clientWidth < row.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [locale]);

  const scroll = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    // "Forward" moves towards the end of the line: left in Arabic, right in English.
    const forwardSign = getComputedStyle(row).direction === "rtl" ? -1 : 1;
    row.scrollBy({
      left: direction * forwardSign * row.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-card transition hover:bg-secondary sm:flex";

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">{categoryName}</h2>
          <p className="text-sm text-muted-foreground">
            {t("available", { count: availableCount })}
          </p>
        </div>
        <Link
          href={`/products?category=${encodeURIComponent(category.slug)}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {t("viewAll")}
          <ArrowLeft className="size-4 ltr:rotate-180" />
        </Link>
      </div>

      <div className="relative">
        {canGoBack && (
          <button
            className={`${arrow} -start-5`}
            onClick={() => scroll(-1)}
            aria-label={common("previous")}
          >
            <ChevronRight className="size-5 ltr:rotate-180" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={updateArrows}
          className="-mx-4 flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0"
        >
          {products.map((product) => (
            <div key={product.id} className="w-56 shrink-0 snap-start sm:w-64">
              <ProductCard product={product} categoryName={categoryName} />
            </div>
          ))}
        </div>

        {canGoForward && (
          <button
            className={`${arrow} -end-5`}
            onClick={() => scroll(1)}
            aria-label={common("next")}
          >
            <ChevronLeft className="size-5 ltr:rotate-180" />
          </button>
        )}
      </div>
    </section>
  );
}
