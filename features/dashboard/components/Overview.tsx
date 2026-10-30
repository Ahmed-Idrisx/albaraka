"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Wallet } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useTranslations } from "next-intl";
import { useFormat } from "@/i18n/useFormat";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RevenueChart, StatusChart, TopProducts } from "@/features/dashboard/components/Charts";
import { ErrorState, Loading } from "@/components/shared/States";

const RANGES = [7, 14, 30];

export function Overview() {
  const t = useTranslations("dashboard.overview");
  const format = useFormat();
  const [days, setDays] = useState(14);

  const stats = useQuery({
    queryKey: queryKeys.orderStats,
    queryFn: ordersApi.stats,
    refetchInterval: 30_000,
  });
  const analytics = useQuery({
    queryKey: queryKeys.orderAnalytics(days),
    queryFn: () => ordersApi.analytics(days),
    placeholderData: keepPreviousData,
  });
  const latest = useQuery({
    queryKey: queryKeys.orders({ limit: 5 }),
    queryFn: () => ordersApi.list({ limit: 5 }),
    refetchInterval: 30_000,
  });

  const cards = stats.data && [
    {
      label: t("todayOrders"),
      value: stats.data.todayOrders,
      icon: CalendarDays,
      tone: "bg-status-confirmed/15 text-status-confirmed",
    },
    {
      label: t("pendingOrders"),
      value: stats.data.pendingOrders,
      icon: Clock,
      tone: "bg-status-pending/15 text-status-pending",
    },
    {
      label: t("deliveredOrders"),
      value: stats.data.deliveredOrders,
      icon: CheckCircle2,
      tone: "bg-status-delivered/15 text-status-delivered",
    },
    {
      label: t("totalRevenue"),
      value: format.price(stats.data.totalRevenue),
      icon: Wallet,
      tone: "bg-fruit-citrus/15 text-fruit-citrus",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={t("title")}
        description={t("description")}
      />

      {stats.error && <ErrorState error={stats.error} />}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards?.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card flex items-center gap-4">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone}`}
            >
              <Icon className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="truncate font-display text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card xl:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="font-bold">{t("dailyRevenue")}</h2>
            <div className="flex rounded-lg bg-muted p-1 text-xs">
              {RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setDays(range)}
                  className={`rounded-md px-3 py-1 ${
                    days === range ? "bg-card font-medium shadow-sm" : ""
                  }`}
                >
                  {t("days", { count: range })}
                </button>
              ))}
            </div>
          </div>
          {analytics.isPending && <Loading />}
          {analytics.data && <RevenueChart daily={analytics.data.daily} />}
        </section>

        <section className="card">
          <h2 className="mb-4 font-bold">{t("byStatus")}</h2>
          {analytics.data && <StatusChart byStatus={analytics.data.byStatus} />}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">{t("latestOrders")}</h2>
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {t("allOrders")}
              <ArrowLeft className="size-4 ltr:rotate-180" />
            </Link>
          </div>
          {latest.isPending && <Loading />}
          {latest.data && <OrdersTable orders={latest.data.items} />}
        </section>

        <section className="card">
          <h2 className="mb-4 font-bold">{t("topProducts")}</h2>
          {analytics.data && (
            <TopProducts products={analytics.data.topProducts} />
          )}
        </section>
      </div>
    </div>
  );
}
