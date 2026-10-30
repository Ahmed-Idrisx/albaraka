"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { MapPin, Pencil } from "lucide-react";
import { toast } from "sonner";
import { deliveryAreasApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import type { DeliveryArea } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { Switch } from "@/components/shared/Switch";
import { Empty, ErrorState, Loading } from "@/components/shared/States";
import { AreaEditRow } from "@/features/delivery-areas/components/AreaEditRow";
import { AreaForm } from "@/features/delivery-areas/components/AreaForm";

export function AreasManager() {
  const t = useTranslations("dashboard.areas");
  const common = useTranslations("common");
  const format = useFormat();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

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
        <AreaForm saving={create.isPending} onCreate={create.mutate} />

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
                      <AreaEditRow
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
