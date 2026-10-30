"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Plus, Search, Tags } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { categoriesApi, productsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useDebounced } from "@/lib/useDebounced";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { Pagination } from "@/components/shared/Pagination";
import { Select } from "@/components/shared/Select";
import { Empty, ErrorState, Loading } from "@/components/shared/States";

export default function DashboardProductsPage() {
  const t = useTranslations("dashboard.products");
  const common = useTranslations("common");
  const format = useFormat();
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
        <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
          <table className="table">
            <thead>
              <tr>
                <th>{t("product")}</th>
                <th>{t("category")}</th>
                <th>{t("price")}</th>
                <th>{t("stock")}</th>
                <th>{t("status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.data.items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="photo-frame relative size-12 shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain p-0.5"
                        />
                      </span>
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {localized(p, "name")}
                      </Link>
                    </div>
                  </td>
                  <td className="text-muted-foreground">
                    {typeof p.category === "object" ? localized(p.category, "name") : "—"}
                  </td>
                  <td className="whitespace-nowrap">
                    <span className="font-medium">
                      {format.price(p.discountPrice ?? p.price)}
                    </span>
                    <span className="text-muted-foreground"> / {localized(p, "unit")}</span>
                    {p.discountPrice != null && (
                      <span className="block text-xs text-muted-foreground line-through">
                        {format.price(p.price)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={
                        p.stock === 0
                          ? "font-medium text-destructive"
                          : p.stock <= 5
                            ? "font-medium text-status-pending"
                            : ""
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.isAvailable
                          ? "bg-status-delivered/15 text-status-delivered"
                          : "bg-status-cancelled/15 text-status-cancelled"
                      }`}
                    >
                      {p.isAvailable ? t("available") : t("unavailable")}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm hover:bg-secondary"
                      >
                        <Pencil className="size-4" />
                        {common("edit")}
                      </Link>
                      <ConfirmButton
                        disabled={remove.isPending}
                        onConfirm={() => remove.mutate(p.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
