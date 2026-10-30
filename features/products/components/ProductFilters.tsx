"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { categoriesApi, productsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useDebounced } from "@/lib/useDebounced";
import { useLocalized } from "@/i18n/useLocalized";
import { Switch } from "@/components/shared/Switch";

export interface FilterValues {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  available: boolean;
}

interface ProductFiltersProps {
  values: FilterValues;
  onChange: (next: Partial<FilterValues>) => void;
}

export const EMPTY_FILTERS: FilterValues = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  available: false,
};

/** How many filters are switched on — shown on the clear button. */
const countActive = (values: FilterValues) =>
  [
    values.search,
    values.category,
    values.minPrice || values.maxPrice,
    values.available,
  ].filter(Boolean).length;

/** The filter panel: search, category, price range and in-stock only. */
export function ProductFilters({ values, onChange }: ProductFiltersProps) {
  const t = useTranslations("products.filters");
  const localized = useLocalized();
  const categories = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });
  const range = useQuery({
    queryKey: queryKeys.priceRange,
    queryFn: productsApi.priceRange,
  });

  // Typed fields update the URL only after the customer stops typing.
  const [draft, setDraft] = useState({
    search: values.search,
    minPrice: values.minPrice,
    maxPrice: values.maxPrice,
  });
  const debounced = useDebounced(draft);

  useEffect(() => {
    if (
      debounced.search !== values.search ||
      debounced.minPrice !== values.minPrice ||
      debounced.maxPrice !== values.maxPrice
    ) {
      onChange(debounced);
    }
    // Only react to the debounced draft, not to every URL change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const activeCount = countActive(values);
  const clearAll = () => {
    setDraft({ search: "", minPrice: "", maxPrice: "" });
    onChange(EMPTY_FILTERS);
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      active
        ? "border-primary bg-primary font-medium text-primary-foreground"
        : "bg-card hover:border-primary hover:text-primary"
    }`;

  return (
    <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("title")}</h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
            {t("clear", { count: activeCount })}
          </button>
        )}
      </div>

      <label className="label" htmlFor="filter-search">
        {t("search")}
      </label>
      <div className="relative">
        <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="filter-search"
          className="input ps-9"
          placeholder={t("searchPlaceholder")}
          value={draft.search}
          onChange={(e) => setDraft({ ...draft, search: e.target.value })}
        />
      </div>

      <hr className="my-5" />

      <p className="label">{t("category")}</p>
      <div className="flex flex-wrap gap-2">
        <button
          className={chip(!values.category)}
          onClick={() => onChange({ category: "" })}
        >
          {t("all")}
        </button>
        {categories.data?.map((c) => (
          <button
            key={c.id}
            className={chip(values.category === c.slug)}
            onClick={() => onChange({ category: c.slug })}
          >
            {localized(c, "name")}
          </button>
        ))}
      </div>

      <hr className="my-5" />

      <p className="label">{t("price")}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          className="input"
          aria-label={t("minPrice")}
          placeholder={t("from", { value: range.data?.min ?? "" })}
          value={draft.minPrice}
          onChange={(e) => setDraft({ ...draft, minPrice: e.target.value })}
        />
        <span className="text-muted-foreground">—</span>
        <input
          type="number"
          min={0}
          className="input"
          aria-label={t("maxPrice")}
          placeholder={t("to", { value: range.data?.max ?? "" })}
          value={draft.maxPrice}
          onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })}
        />
      </div>

      <hr className="my-5" />

      <Switch
        label={t("availableOnly")}
        checked={values.available}
        onChange={(available) => onChange({ available })}
      />
    </aside>
  );
}
