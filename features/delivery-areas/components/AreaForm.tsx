"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import type { DeliveryArea } from "@/lib/types";
import { BilingualField } from "@/components/dashboard/BilingualField";
import { FormField } from "@/components/shared/FormField";

type AreaErrors = { name?: string; price?: string };

interface AreaFormProps {
  saving: boolean;
  onCreate: (
    data: Partial<DeliveryArea>,
    options: { onSuccess: () => void },
  ) => void;
}

export function AreaForm({ saving, onCreate }: AreaFormProps) {
  const t = useTranslations("dashboard.areas");
  const common = useTranslations("common");
  const [errors, setErrors] = useState<AreaErrors>({});

  return (
    <form
      noValidate
      className="card space-y-4 p-6 lg:sticky lg:top-6"
      onSubmit={(e) => {
        e.preventDefault();
        const formElement = e.currentTarget;
        const form = new FormData(formElement);
        const name = String(form.get("name")).trim();
        const price = String(form.get("price")).trim();

        const found: AreaErrors = {};
        if (name.length < 2) found.name = t("nameRequired");
        if (price === "") found.price = t("priceRequired");
        else if (Number(price) < 0) found.price = t("priceNegative");
        setErrors(found);
        if (found.name || found.price) return;

        onCreate(
          {
            name,
            nameEn: String(form.get("nameEn")).trim(),
            price: Number(price),
          },
          { onSuccess: () => formElement.reset() },
        );
      }}
    >
      <h2 className="font-bold">{t("newArea")}</h2>
      <BilingualField
        name="name"
        label={t("name")}
        required
        placeholderAr="المعادي"
        placeholderEn="Maadi"
        error={errors.name}
      />
      <FormField
        htmlFor="area-price"
        label={t("price")}
        required
        hint={t("priceHint")}
        error={errors.price}
      >
        <input
          id="area-price"
          name="price"
          type="number"
          min={0}
          className="input"
          placeholder="20"
          aria-invalid={!!errors.price}
        />
      </FormField>
      <button className="btn w-full" disabled={saving}>
        <Plus className="size-4" />
        {saving ? common("adding") : t("add")}
      </button>
    </form>
  );
}
