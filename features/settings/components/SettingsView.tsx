"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { settingsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorState, Loading } from "@/components/shared/States";
import { SettingsForm } from "@/features/settings/components/SettingsForm";

export function SettingsView() {
  const t = useTranslations("dashboard.settings");
  const settings = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
  });

  return (
    <>
      <DashboardHeader title={t("title")} description={t("description")} />
      {settings.isPending && <Loading />}
      {settings.error && <ErrorState error={settings.error} />}
      {settings.data && <SettingsForm settings={settings.data} />}
    </>
  );
}
