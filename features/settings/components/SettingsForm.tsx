"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Phone, Plus, Store, X } from "lucide-react";
import { toast } from "sonner";
import { settingsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import type { Settings, Unit } from "@/lib/types";
import { BilingualField } from "@/components/dashboard/BilingualField";
import { FormField } from "@/components/shared/FormField";

export function SettingsForm({ settings }: { settings: Settings }) {
  const t = useTranslations("dashboard.settings");
  const form = useTranslations("dashboard.form");
  const common = useTranslations("common");
  const queryClient = useQueryClient();
  const [units, setUnits] = useState<Unit[]>(settings.units);
  const [unitsError, setUnitsError] = useState("");

  const save = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.settings, updated);
      // Products show their unit's English name, so refresh them too.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("saved"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const setUnit = (index: number, change: Partial<Unit>) =>
    setUnits(units.map((u, i) => (i === index ? { ...u, ...change } : u)));

  return (
    <form
      noValidate
      className="grid max-w-5xl items-start gap-6 lg:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const cleaned = units
          .map((u) => ({ ar: u.ar.trim(), en: u.en.trim() }))
          .filter((u) => u.ar);

        // Every unit needs an Arabic name, and no Arabic name twice.
        const names = cleaned.map((u) => u.ar);
        if (cleaned.length === 0) return setUnitsError(t("unitsRequired"));
        if (new Set(names).size !== names.length) {
          return setUnitsError(t("unitsDuplicate"));
        }
        setUnitsError("");

        save.mutate({
          storeName: String(data.get("storeName")).trim(),
          storeNameEn: String(data.get("storeNameEn")).trim(),
          storePhone: String(data.get("storePhone")).trim(),
          workingHours: String(data.get("workingHours")).trim(),
          workingHoursEn: String(data.get("workingHoursEn")).trim(),
          units: cleaned,
        });
      }}
    >
      <section className="card space-y-5 p-6">
        <h2 className="flex items-center gap-2 font-bold">
          <Store className="size-5 text-primary" />
          {t("store")}
        </h2>
        <BilingualField
          name="storeName"
          label={t("storeName")}
          defaultAr={settings.storeName}
          defaultEn={settings.storeNameEn}
          placeholderAr="البركة"
          placeholderEn="Al Baraka"
        />
        <FormField htmlFor="storePhone" label={t("phone")} hint={t("phoneHint")}>
          {/* The number reads left-to-right in both languages; the icon sits
              at the start of the line and the padding follows it. */}
          <div className="relative">
            <Phone className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="storePhone"
              name="storePhone"
              dir="ltr"
              className="input ltr:pl-9 rtl:pr-9 rtl:text-right"
              defaultValue={settings.storePhone}
            />
          </div>
        </FormField>
        <BilingualField
          name="workingHours"
          label={t("hours")}
          defaultAr={settings.workingHours}
          defaultEn={settings.workingHoursEn}
          placeholderAr="من 9 صباحًا حتى 11 مساءً"
          placeholderEn="9 AM to 11 PM"
        />
      </section>

      <section className="card space-y-4 p-6">
        <div>
          <h2 className="font-bold">{t("units")}</h2>
          <p className="text-sm text-muted-foreground">{t("unitsHint")}</p>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_2.25rem] gap-2 text-xs font-medium text-muted-foreground">
            <span>{form("arabic")}</span>
            <span>{form("english")}</span>
          </div>
          {units.map((unit, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_2.25rem] gap-2">
              <input
                className="input"
                lang="ar"
                dir="rtl"
                aria-label={`${t("unit")} ${index + 1} (${form("arabic")})`}
                aria-invalid={!unit.ar.trim()}
                value={unit.ar}
                onChange={(e) => setUnit(index, { ar: e.target.value })}
              />
              <input
                className="input"
                lang="en"
                dir="ltr"
                placeholder={t("unitEnPlaceholder")}
                aria-label={`${t("unit")} ${index + 1} (${form("english")})`}
                value={unit.en}
                onChange={(e) => setUnit(index, { en: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setUnits(units.filter((_, i) => i !== index))}
                className="flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={t("removeUnit", { unit: unit.ar || index + 1 })}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {unitsError && <p className="text-xs text-destructive">{unitsError}</p>}

        <button
          type="button"
          className="btn-outline w-full"
          onClick={() => setUnits([...units, { ar: "", en: "" }])}
        >
          <Plus className="size-4" />
          {t("addUnit")}
        </button>
        <p className="text-xs text-muted-foreground">{t("unitsNote")}</p>
      </section>

      <div className="lg:col-span-2">
        <button className="btn h-11 min-w-40" disabled={save.isPending}>
          {save.isPending ? common("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
