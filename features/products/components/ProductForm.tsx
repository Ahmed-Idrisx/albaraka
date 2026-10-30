"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { categoriesApi, productsApi, settingsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import type { Product } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { BilingualField } from "@/components/dashboard/BilingualField";
import { FormField } from "@/components/shared/FormField";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Select } from "@/components/shared/Select";
import { Switch } from "@/components/shared/Switch";

/** One form for both adding and editing. Sends multipart because of the image. */
export function ProductForm({ product }: { product?: Product }) {
  const t = useTranslations("dashboard.productForm");
  const common = useTranslations("common");
  const locale = useLocale();
  const format = useFormat();
  const localized = useLocalized();
  const router = useRouter();
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });
  const settings = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
  });

  const [category, setCategory] = useState(
    typeof product?.category === "object"
      ? product.category.id
      : (product?.category ?? ""),
  );
  // Units are stored by their Arabic name; the API adds the English one.
  const [unit, setUnit] = useState(product?.unit ?? "");
  const [available, setAvailable] = useState(product?.isAvailable ?? true);
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [discount, setDiscount] = useState(String(product?.discountPrice ?? ""));
  const [missing, setMissing] = useState<string[]>([]);

  const save = useMutation({
    mutationFn: (form: FormData) =>
      product ? productsApi.update(product.id, form) : productsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(product ? t("saved") : t("created"));
      router.push("/dashboard/products");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const unitOptions = (settings.data?.units ?? []).map((u) => ({
    value: u.ar,
    label: locale === "en" && u.en ? u.en : u.ar,
  }));
  const unitLabel = unitOptions.find((u) => u.value === unit)?.label;

  const priceNumber = Number(price);
  const discountNumber = Number(discount);
  const discountError =
    discount && price && discountNumber >= priceNumber
      ? t("discountTooHigh")
      : undefined;
  const discountPercent =
    discount && price && !discountError
      ? Math.round((1 - discountNumber / priceNumber) * 100)
      : 0;

  return (
    <form
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const image = form.get("image");
        const hasImage = image instanceof File && image.size > 0;

        // The custom dropdowns and image picker aren't native required fields,
        // so the form checks them itself.
        const absent = [
          !String(form.get("name")).trim() && "name",
          !category && "category",
          !unit && "unit",
          !price && "price",
          !product && !hasImage && "image",
        ].filter(Boolean) as string[];
        setMissing(absent);
        if (absent.length || discountError) {
          toast.error(t("fixErrors"));
          return;
        }

        // Editing without picking a new image keeps the old one.
        if (!hasImage) form.delete("image");
        save.mutate(form);
      }}
    >
      <div className="space-y-6">
        <section className="card space-y-5 p-6">
          <h2 className="font-bold">{t("details")}</h2>

          <BilingualField
            name="name"
            label={t("name")}
            required
            defaultAr={product?.name}
            defaultEn={product?.nameEn}
            placeholderAr="طماطم بلدي"
            placeholderEn="Local tomatoes"
            error={missing.includes("name") ? t("nameRequired") : undefined}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label={t("category")}
              required
              error={missing.includes("category") ? t("categoryRequired") : undefined}
            >
              <Select
                name="category"
                value={category}
                onChange={setCategory}
                invalid={missing.includes("category")}
                placeholder={t("categoryPlaceholder")}
                options={(categories.data ?? []).map((c) => ({
                  value: c.id,
                  label: localized(c, "name"),
                }))}
              />
            </FormField>
            <FormField
              label={t("unit")}
              required
              hint={t("unitHint")}
              error={missing.includes("unit") ? t("unitRequired") : undefined}
            >
              <Select
                name="unit"
                value={unit}
                onChange={setUnit}
                invalid={missing.includes("unit")}
                placeholder={t("unitPlaceholder")}
                options={unitOptions}
              />
            </FormField>
          </div>

          <BilingualField
            name="description"
            label={t("description")}
            multiline
            defaultAr={product?.description}
            defaultEn={product?.descriptionEn}
            placeholderAr="طماطم بلدي حمرا ومناسبة للسلطة"
            placeholderEn="Ripe local tomatoes, great for salads"
            hint={t("descriptionHint")}
          />
        </section>

        <section className="card space-y-5 p-6">
          <h2 className="font-bold">{t("pricing")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              htmlFor="price"
              label={t("price")}
              required
              hint={unitLabel ? t("pricePerUnitHint", { unit: unitLabel }) : t("priceHint")}
              error={missing.includes("price") ? t("priceRequired") : undefined}
            >
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step="0.5"
                className="input"
                aria-invalid={missing.includes("price")}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormField>
            <FormField
              htmlFor="discountPrice"
              label={t("discountPrice")}
              hint={
                discountPercent > 0
                  ? t("discountPreview", {
                      percent: discountPercent,
                      price: format.price(discountNumber),
                    })
                  : t("discountHint")
              }
              error={discountError}
            >
              <input
                id="discountPrice"
                name="discountPrice"
                type="number"
                min={0}
                step="0.5"
                className="input"
                placeholder={common("optional")}
                aria-invalid={!!discountError}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </FormField>
            <FormField htmlFor="stock" label={t("stock")} hint={t("stockHint")}>
              <input
                id="stock"
                name="stock"
                type="number"
                min={0}
                className="input"
                defaultValue={product?.stock ?? 0}
              />
            </FormField>
          </div>
        </section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6">
        <section className="card space-y-3 p-6">
          <h2 className="font-bold">
            {t("image")}{" "}
            {!product && <span className="text-destructive">*</span>}
          </h2>
          <ImageUpload
            name="image"
            currentUrl={product?.image}
            invalid={missing.includes("image")}
          />
          {missing.includes("image") && (
            <p className="text-xs text-destructive">{t("imageRequired")}</p>
          )}
          <p className="text-xs text-muted-foreground">{t("imageHint")}</p>
        </section>

        <section className="card p-6">
          <Switch
            name="isAvailable"
            checked={available}
            onChange={setAvailable}
            label={t("available")}
            description={available ? t("availableOn") : t("availableOff")}
          />
        </section>

        <div className="flex gap-3">
          <button className="btn h-11 flex-1" disabled={save.isPending}>
            {save.isPending
              ? common("saving")
              : product
                ? t("saveChanges")
                : t("create")}
          </button>
          <Link href="/dashboard/products" className="btn-outline h-11">
            {common("cancel")}
          </Link>
        </div>
      </aside>
    </form>
  );
}
