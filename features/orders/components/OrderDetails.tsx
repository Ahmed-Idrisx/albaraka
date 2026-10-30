"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ordersApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useFormat } from "@/i18n/useFormat";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState, Loading } from "@/components/shared/States";
import { OrderCustomerCard } from "@/features/orders/components/OrderCustomerCard";
import { OrderItemsCard } from "@/features/orders/components/OrderItemsCard";
import { OrderStatusCard } from "@/features/orders/components/OrderStatusCard";

export function OrderDetails({ id }: { id: string }) {
  const t = useTranslations("dashboard.order");
  const format = useFormat();
  const queryClient = useQueryClient();

  const order = useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersApi.byId(id),
  });

  const update = useMutation({
    mutationFn: (change: { status?: OrderStatus; payment?: PaymentStatus }) =>
      change.status
        ? ordersApi.setStatus(id, change.status)
        : ordersApi.setPayment(id, change.payment!),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.order(id), updated);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(t("updated"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (order.isPending) return <Loading />;
  if (order.error) return <ErrorState error={order.error} />;

  const o = order.data;

  return (
    <>
      <DashboardHeader
        back={{ href: "/dashboard/orders", label: t("back") }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono tracking-wide" dir="ltr">
              {o.orderNumber}
            </span>
            <StatusBadge status={o.status} />
          </span>
        }
        description={format.date(o.createdAt)}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <OrderItemsCard order={o} />

        <aside className="space-y-6">
          <OrderStatusCard
            order={o}
            pending={update.isPending}
            onUpdate={update.mutate}
          />

          <OrderCustomerCard order={o} />
        </aside>
      </div>
    </>
  );
}
