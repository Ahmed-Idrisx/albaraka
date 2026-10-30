"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowDownUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { productsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import type { ProductSort } from "@/lib/types";
import { ProductGrid } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Empty, ErrorState } from "@/components/shared/States";
import { Select } from "@/components/shared/Select";
import {
  ProductFilters,
  type FilterValues,
} from "@/features/products/components/ProductFilters";

const SORTS: ProductSort[] = ["newest", "price_asc", "price_desc"];

function Products() {
  const t = useTranslations("products");
  const router = useRouter();
  const params = useSearchParams();

  // Every filter lives in the URL, so a filtered list can be shared or refreshed.
  const values: FilterValues = {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    available: params.get("available") === "true",
  };
  const sort = (params.get("sort") as ProductSort) || "newest";
  const page = Number(params.get("page") ?? 1);

  const update = (next: Record<string, string | number | boolean>) => {
    const merged = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (value === "" || value === false) merged.delete(key);
      else merged.set(key, String(value));
    }
    // Any filter change starts again from page 1.
    if (!("page" in next)) merged.delete("page");
    router.replace(`/products?${merged}`, { scroll: false });
  };

  const filters = {
    search: values.search || undefined,
    category: values.category || undefined,
    minPrice: values.minPrice ? Number(values.minPrice) : undefined,
    maxPrice: values.maxPrice ? Number(values.maxPrice) : undefined,
    available: values.available || undefined,
    sort,
    page,
    limit: 12,
  };
  const products = useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productsApi.list(filters),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={
          <Select
            className="w-56"
            aria-label={t("sortLabel")}
            icon={<ArrowDownUp className="size-4" />}
            value={sort}
            options={SORTS.map((value) => ({
              value,
              label: t(`sort.${value}`),
            }))}
            onChange={(next) => update({ sort: next === "newest" ? "" : next })}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <ProductFilters values={values} onChange={update} />

        <div>
          {products.data && (
            <p className="mb-4 text-sm text-muted-foreground">
              {t("count", { count: products.data.total })}
            </p>
          )}

          {products.isPending && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          {products.error && <ErrorState error={products.error} />}
          {products.data?.items.length === 0 && (
            <Empty text={t("empty")} />
          )}
          {products.data && (
            <div
              className={
                products.isPlaceholderData ? "opacity-60 transition" : ""
              }
            >
              <ProductGrid products={products.data.items} />
              <Pagination
                page={page}
                pages={products.data.pages}
                onChange={(next) => update({ page: next })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
