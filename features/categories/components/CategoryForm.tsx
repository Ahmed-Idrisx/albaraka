"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Category } from "@/lib/types";
import { BilingualField } from "@/components/dashboard/BilingualField";
import { FormField } from "@/components/shared/FormField";
import { ImageUpload } from "@/components/shared/ImageUpload";

/** Add or edit a category in place, inside its own card. */
export function CategoryForm({
  category,
  saving,
  onSubmit,
  onCancel,
}: {
  category?: Category;
  saving: boolean;
  onSubmit: (form: FormData) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("dashboard.categories");
  const common = useTranslations("common");
  const [imageMissing, setImageMissing] = useState(false);
  const [nameMissing, setNameMissing] = useState(false);
  const idBase = category?.id ?? "new";

  return (
    <form
      noValidate
      className="card space-y-4 border-primary p-4 ring-3 ring-primary/15"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const image = form.get("image");
        const hasImage = image instanceof File && image.size > 0;
        const noName = !String(form.get("name")).trim();
        const noImage = !category && !hasImage;
        setNameMissing(noName);
        setImageMissing(noImage);
        if (noName || noImage) return;
        if (!hasImage) form.delete("image");
        onSubmit(form);
      }}
    >
      <ImageUpload
        name="image"
        currentUrl={category?.image}
        invalid={imageMissing}
        onChange={() => setImageMissing(false)}
      />
      {imageMissing && (
        <p className="text-xs text-destructive">{t("imageRequired")}</p>
      )}

      <BilingualField
        name="name"
        label={t("name")}
        required
        defaultAr={category?.name}
        defaultEn={category?.nameEn}
        placeholderAr="فاكهة"
        placeholderEn="Fruits"
        error={nameMissing ? t("nameRequired") : undefined}
        onChangeAr={() => setNameMissing(false)}
      />

      <FormField htmlFor={`order-${idBase}`} label={t("order")} hint={t("orderHint")}>
        <input
          id={`order-${idBase}`}
          name="order"
          type="number"
          min={0}
          className="input w-28"
          defaultValue={category?.order ?? 0}
        />
      </FormField>

      <div className="flex gap-2">
        <button className="btn flex-1" disabled={saving}>
          {saving ? common("saving") : category ? common("save") : common("add")}
        </button>
        <button type="button" className="btn-outline" onClick={onCancel}>
          {common("cancel")}
        </button>
      </div>
    </form>
  );
}
