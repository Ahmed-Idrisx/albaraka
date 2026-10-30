"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tags } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { categoriesApi, productsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useLocalized } from "@/i18n/useLocalized";
import { useDebounced } from "@/lib/useDebounced";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Select } from "@/components/shared/Select";
import { Empty, ErrorState, Loading } from "@/components/shared/States";
import { ProductsTable } from "@/features/products/components/ProductsTable";

export function ProductsManager() {
  const t = useTranslations("dashboard.products");
  const localized = useLocalized();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounced(search);

  const categories = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });

  const filters = {
    search: debouncedSearch || undefined,
    category: category || undefined,
    page,
    limit: 20,
  };
  const products = useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productsApi.list(filters),
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("deleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      <DashboardHeader
        title={t("title")}
        description={
          products.data ? t("description", { count: products.data.total }) : undefined
        }
        action={
          <Link href="/dashboard/products/add" className="btn">
            <Plus className="size-4" />
            {t("add")}
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="input ps-9"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="w-52"
          aria-label={t("category")}
          icon={<Tags className="size-4" />}
          value={category}
          onChange={(next) => {
            setCategory(next);
            setPage(1);
          }}
          options={[
            { value: "", label: t("allCategories") },
            ...(categories.data ?? []).map((c) => ({
              value: c.slug,
              label: localized(c, "name"),
            })),
          ]}
        />
      </div>

      {products.isPending && <Loading />}
      {products.error && <ErrorState error={products.error} />}
      {products.data?.items.length === 0 && (
        <div className="card py-12 text-center">
          <Empty text={t("empty")} />
          <Link href="/dashboard/products/add" className="btn">
            <Plus className="size-4" />
            {t("addFirst")}
          </Link>
        </div>
      )}

      {!!products.data?.items.length && (
        <ProductsTable
          products={products.data.items}
          deleting={remove.isPending}
          onDelete={remove.mutate}
        />
      )}

      {products.data && (
        <Pagination
          page={page}
          pages={products.data.pages}
          onChange={setPage}
        />
      )}
    </>
  );
}
