"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useLocalized } from "@/i18n/useLocalized";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { Empty, ErrorState, Loading } from "@/components/shared/States";
import { CategoryForm } from "@/features/categories/components/CategoryForm";

export function CategoriesManager() {
  const t = useTranslations("dashboard.categories");
  const common = useTranslations("common");
  const localized = useLocalized();
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });

  const refresh = (message: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    queryClient.invalidateQueries({ queryKey: queryKeys.home });
    toast.success(message);
  };
  const onError = (error: unknown) => toast.error(getErrorMessage(error));

  const create = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      refresh(t("created"));
      setAdding(false);
    },
    onError,
  });
  const update = useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      categoriesApi.update(id, form),
    onSuccess: () => {
      refresh(t("updated"));
      setEditingId(null);
    },
    onError,
  });
  const remove = useMutation({
    mutationFn: categoriesApi.remove,
    onSuccess: () => refresh(t("deleted")),
    onError,
  });

  return (
    <>
      <DashboardHeader
        title={t("title")}
        description={t("description")}
        action={
          !adding && (
            <button className="btn" onClick={() => setAdding(true)}>
              <Plus className="size-4" />
              {t("add")}
            </button>
          )
        }
      />

      {categories.isPending && <Loading />}
      {categories.error && <ErrorState error={categories.error} />}
      {categories.data?.length === 0 && !adding && <Empty text={t("empty")} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adding && (
          <CategoryForm
            saving={create.isPending}
            onCancel={() => setAdding(false)}
            onSubmit={(form) => create.mutate(form)}
          />
        )}

        {categories.data?.map((category) =>
          editingId === category.id ? (
            <CategoryForm
              key={category.id}
              category={category}
              saving={update.isPending}
              onCancel={() => setEditingId(null)}
              onSubmit={(form) => update.mutate({ id: category.id, form })}
            />
          ) : (
            <div key={category.id} className="card flex flex-col p-4">
              <div className="photo-frame relative mb-3 aspect-square overflow-hidden rounded-xl">
                <Image
                  src={category.image}
                  alt={localized(category, "name")}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold" lang="ar" dir="rtl">
                    {category.name}
                  </p>
                  {/* The English name, or a nudge to add it. */}
                  <p
                    lang="en"
                    dir="ltr"
                    className={`text-sm ${category.nameEn ? "text-muted-foreground" : "text-status-pending"}`}
                  >
                    {category.nameEn || t("noEnglish")}
                  </p>
                </div>
                <span className="badge shrink-0 bg-muted text-muted-foreground">
                  {t("orderBadge", { order: category.order ?? 0 })}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-1">
                <button
                  className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm hover:bg-secondary"
                  onClick={() => setEditingId(category.id)}
                >
                  <Pencil className="size-4" />
                  {common("edit")}
                </button>
                <ConfirmButton
                  disabled={remove.isPending}
                  onConfirm={() => remove.mutate(category.id)}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
}
