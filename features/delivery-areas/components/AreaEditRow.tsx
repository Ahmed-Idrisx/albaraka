"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import type { DeliveryArea } from "@/lib/types";

/** A table row turned into Arabic name, English name and price inputs. */
export function AreaEditRow({
  area,
  saving,
  onSave,
  onCancel,
}: {
  area: DeliveryArea;
  saving: boolean;
  onSave: (data: { name: string; nameEn: string; price: number }) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("dashboard.areas");
  const common = useTranslations("common");
  const form = useTranslations("dashboard.form");
  const [name, setName] = useState(area.name);
  const [nameEn, setNameEn] = useState(area.nameEn ?? "");
  const [price, setPrice] = useState(String(area.price));
  const valid = name.trim().length >= 2 && price !== "" && Number(price) >= 0;

  return (
    <tr className="bg-secondary/40">
      <td className="space-y-2">
        <input
          className="input"
          lang="ar"
          dir="rtl"
          aria-label={`${t("name")} (${form("arabic")})`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <input
          className="input"
          lang="en"
          dir="ltr"
          placeholder={form("english")}
          aria-label={`${t("name")} (${form("english")})`}
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
      </td>
      <td>
        <input
          className="input w-28"
          type="number"
          min={0}
          aria-label={t("price")}
          aria-invalid={price === "" || Number(price) < 0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </td>
      <td />
      <td>
        <div className="flex items-center justify-end gap-1">
          <button
            className="btn h-9 px-3"
            disabled={saving || !valid}
            onClick={() =>
              onSave({
                name: name.trim(),
                nameEn: nameEn.trim(),
                price: Number(price),
              })
            }
          >
            <Check className="size-4" />
            {common("save")}
          </button>
          <button
            className="btn-ghost size-9"
            onClick={onCancel}
            aria-label={common("cancel")}
          >
            <X className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
