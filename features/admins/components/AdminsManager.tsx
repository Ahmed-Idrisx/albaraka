"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { adminsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorState, Loading } from "@/components/shared/States";
import { AdminForm } from "@/features/admins/components/AdminForm";
import { AdminsTable } from "@/features/admins/components/AdminsTable";

/** Superadmin only — the API returns 403 for everyone else. */
export function AdminsManager() {
  const t = useTranslations("dashboard.admins");
  const queryClient = useQueryClient();

  const admins = useQuery({
    queryKey: queryKeys.admins,
    queryFn: adminsApi.list,
  });

  const remove = useMutation({
    mutationFn: adminsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      toast.success(t("deleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      <DashboardHeader title={t("title")} description={t("description")} />

      <div className="grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
        <AdminForm />

        <section>
          {admins.isPending && <Loading />}
          {admins.error && <ErrorState error={admins.error} />}
          {admins.data && (
            <AdminsTable
              admins={admins.data}
              deleting={remove.isPending}
              onDelete={remove.mutate}
            />
          )}
        </section>
      </div>
    </>
  );
}
