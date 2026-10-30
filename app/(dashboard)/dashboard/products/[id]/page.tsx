"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { productsApi } from "@/lib/api";
import { useLocalized } from "@/i18n/useLocalized";
import { queryKeys } from "@/lib/queryClient";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorState, Loading } from "@/components/shared/States";

export default function EditProductPage({
  params,
}: PageProps<"/dashboard/products/[id]">) {
  const { id } = use(params);
  const t = useTranslations("dashboard.productForm");
  const localized = useLocalized();
  const product = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.byId(id),
  });

  return (
    <>
      <DashboardHeader
        title={
          product.data
            ? t("editTitleNamed", { name: localized(product.data, "name") })
            : t("editTitle")
        }
        back={{ href: "/dashboard/products", label: t("back") }}
      />
      {product.isPending && <Loading />}
      {product.error && <ErrorState error={product.error} />}
      {/* Keyed so the form's state starts fresh if another product loads. */}
      {product.data && <ProductForm key={product.data.id} product={product.data} />}
    </>
  );
}
