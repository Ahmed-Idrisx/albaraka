import { useTranslations } from "next-intl";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function AddProductPage() {
  const t = useTranslations("dashboard.productForm");
  return (
    <>
      <DashboardHeader
        title={t("addTitle")}
        description={t("addDescription")}
        back={{ href: "/dashboard/products", label: t("back") }}
      />
      <ProductForm />
    </>
  );
}
