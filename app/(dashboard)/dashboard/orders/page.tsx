"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ordersApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import type { OrderStatus } from "@/lib/types";
import {
  ORDER_STATUSES,
  ORDER_STATUS_BAR,
} from "@/constant/site";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Pagination } from "@/components/shared/Pagination";
import { ErrorState, Loading } from "@/components/shared/States";

export default function OrdersPage() {
  const t = useTranslations("dashboard.orders");
  const statuses = useTranslations("orderStatus");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);

  const filters = { status: status || undefined, page, limit: 20 };
  const orders = useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () => ordersApi.list(filters),
    placeholderData: keepPreviousData,
    // New orders show up without a refresh.
    refetchInterval: 30_000,
  });

  const tab = (value: OrderStatus | "", label: string) => (
    <button
      key={value || "all"}
      onClick={() => {
        setStatus(value);
        setPage(1);
      }}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition ${
        status === value
          ? "border-primary bg-primary font-medium text-primary-foreground"
          : "bg-card hover:border-primary"
      }`}
    >
      {value && (
        <span className={`size-2 rounded-full ${ORDER_STATUS_BAR[value]}`} />
      )}
      {label}
    </button>
  );

  return (
    <>
      <DashboardHeader
        title={t("title")}
        description={
          orders.data
            ? t("description", { count: orders.data.total })
            : undefined
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tab("", t("all"))}
        {ORDER_STATUSES.map((s) => tab(s, statuses(s)))}
      </div>

      {orders.isPending && <Loading />}
      {orders.error && <ErrorState error={orders.error} />}
      {orders.data && (
        <div className={orders.isPlaceholderData ? "opacity-60" : ""}>
          <OrdersTable orders={orders.data.items} />
          <Pagination
            page={page}
            pages={orders.data.pages}
            onChange={setPage}
          />
        </div>
      )}
    </>
  );
}
