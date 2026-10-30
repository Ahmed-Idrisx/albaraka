"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Check, MapPin, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { deliveryAreasApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import type { DeliveryArea } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BilingualField } from "@/components/dashboard/BilingualField";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { FormField } from "@/components/shared/FormField";
import { Switch } from "@/components/shared/Switch";
import { Empty, ErrorState, Loading } from "@/components/shared/States";

type AreaErrors = { name?: string; price?: string };

export default function DashboardDeliveryAreasPage() {
  const t = useTranslations("dashboard.areas");
  const common = useTranslations("common");
  const format = useFormat();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<AreaErrors>({});

  const areas = useQuery({
    queryKey: queryKeys.deliveryAreas(false),
    queryFn: () => deliveryAreasApi.list(false),
  });

  const refresh = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["delivery-areas"] });
    toast.success(message);
  };
  const onError = (error: unknown) => toast.error(getErrorMessage(error));

  const create = useMutation({
    mutationFn: deliveryAreasApi.create,
    onSuccess: () => refresh(t("created")),
    onError,
  });
  const update = useMutation({
    mutationFn: ({ id, ...data }: Partial<DeliveryArea> & { id: string }) =>
      deliveryAreasApi.update(id, data),
    onSuccess: () => {
      refresh(t("updated"));
      setEditingId(null);
    },
    onError,
  });
  const remove = useMutation({
    mutationFn: deliveryAreasApi.remove,
    onSuccess: () => refresh(t("deleted")),
    onError,
  });

  const activeCount = areas.data?.filter((a) => a.isActive).length ?? 0;

  return (
    <>
      <DashboardHeader title={t("title")} description={t("description")} />

      <div className="grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
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

            create.mutate(
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
          <button className="btn w-full" disabled={create.isPending}>
            <Plus className="size-4" />
            {create.isPending ? common("adding") : t("add")}
          </button>
        </form>

        <section>
          {areas.isPending && <Loading />}
          {areas.error && <ErrorState error={areas.error} />}
          {areas.data?.length === 0 && (
            <div className="card">
              <Empty text={t("empty")} />
            </div>
          )}

          {!!areas.data?.length && (
            <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
              <p className="border-b px-4 py-3 text-sm text-muted-foreground">
                {t("summary", { total: areas.data.length, active: activeCount })}
              </p>
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("area")}</th>
                    <th>{t("price")}</th>
                    <th>{t("active")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {areas.data.map((area) =>
                    editingId === area.id ? (
                      <EditRow
                        key={area.id}
                        area={area}
                        saving={update.isPending}
                        onCancel={() => setEditingId(null)}
                        onSave={(data) => update.mutate({ id: area.id, ...data })}
                      />
                    ) : (
                      <tr key={area.id} className={area.isActive ? "" : "opacity-60"}>
                        <td>
                          <span className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>
                              <span className="block font-medium" lang="ar" dir="rtl">
                                {area.name}
                              </span>
                              <span
                                lang="en"
                                dir="ltr"
                                className={`block text-xs ${area.nameEn ? "text-muted-foreground" : "text-status-pending"}`}
                              >
                                {area.nameEn || t("noEnglish")}
                              </span>
                            </span>
                          </span>
                        </td>
                        <td className="font-medium">{format.price(area.price)}</td>
                        <td>
                          <Switch
                            label={<span className="sr-only">{t("active")}</span>}
                            checked={area.isActive}
                            disabled={update.isPending}
                            onChange={(isActive) =>
                              update.mutate({ id: area.id, isActive })
                            }
                          />
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm hover:bg-secondary"
                              onClick={() => setEditingId(area.id)}
                            >
                              <Pencil className="size-4" />
                              {common("edit")}
                            </button>
                            <ConfirmButton
                              disabled={remove.isPending}
                              onConfirm={() => remove.mutate(area.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/** A table row turned into Arabic name, English name and price inputs. */
function EditRow({
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
