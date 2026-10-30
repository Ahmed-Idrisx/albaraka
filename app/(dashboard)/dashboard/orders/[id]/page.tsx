"use client";

import { use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, MessageSquareText, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ordersApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import {
  ORDER_STATUSES,
  ORDER_STATUS_BAR,
} from "@/constant/site";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Select } from "@/components/shared/Select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState, Loading } from "@/components/shared/States";

/** The status an order normally moves to next, for the one-click button. */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

export default function OrderDetailPage({
  params,
}: PageProps<"/dashboard/orders/[id]">) {
  const { id } = use(params);
  const t = useTranslations("dashboard.order");
  const statuses = useTranslations("orderStatus");
  const payment = useTranslations("payment");
  const format = useFormat();
  const localized = useLocalized();
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
  const next = NEXT_STATUS[o.status];

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
        <section className="card p-0">
          <h2 className="border-b px-6 py-4 font-bold">
            {t("items", { count: o.items.length })}
          </h2>
          <table className="table">
            <thead>
              <tr>
                <th>{t("product")}</th>
                <th>{t("quantity")}</th>
                <th>{t("unitPrice")}</th>
                <th className="text-end">{t("lineTotal")}</th>
              </tr>
            </thead>
            <tbody>
              {o.items.map((item) => (
                <tr key={item.product}>
                  <td className="font-medium">{localized(item, "name")}</td>
                  <td>
                    {item.quantity} {localized(item, "unit")}
                  </td>
                  <td className="text-muted-foreground">
                    {format.price(item.price)}
                  </td>
                  <td className="text-end font-medium">
                    {format.price(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-2 border-t px-6 py-4 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{format.price(o.subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">
                {t("delivery")}{" "}
                {o.deliveryArea && `(${localized(o.deliveryArea, "name")})`}
              </span>
              <span>{format.price(o.deliveryFee)}</span>
            </p>
            <p className="flex items-baseline justify-between border-t pt-3">
              <span className="font-bold">{t("total")}</span>
              <span className="font-display text-2xl font-bold text-primary">
                {format.price(o.total)}
              </span>
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card space-y-4 p-6">
            <h2 className="font-bold">{t("status")}</h2>
            {next && (
              <button
                className="btn h-11 w-full"
                disabled={update.isPending}
                onClick={() => update.mutate({ status: next })}
              >
                {t("moveTo", { status: statuses(next) })}
                <ArrowLeft className="size-4 ltr:rotate-180" />
              </button>
            )}
            <Select
              aria-label={t("status")}
              value={o.status}
              disabled={update.isPending}
              icon={
                <span
                  className={`block size-2.5 rounded-full ${ORDER_STATUS_BAR[o.status]}`}
                />
              }
              onChange={(status) =>
                status !== o.status && update.mutate({ status })
              }
              options={ORDER_STATUSES.map((s) => ({
                value: s,
                label: statuses(s),
              }))}
            />
            {o.status !== "cancelled" && (
              <p className="text-xs text-muted-foreground">
                {t("cancelNote")}
              </p>
            )}

            <div className="border-t pt-4">
              <p className="label">{t("payment")}</p>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-sm">
                {(["unpaid", "paid"] as const).map((value) => (
                  <button
                    key={value}
                    disabled={update.isPending}
                    onClick={() =>
                      value !== o.paymentStatus &&
                      update.mutate({ payment: value })
                    }
                    className={`rounded-md py-2 transition ${
                      o.paymentStatus === value
                        ? "bg-card font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {payment(value)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="card space-y-4 p-6 text-sm">
            <h2 className="font-bold">{t("customer")}</h2>
            <p className="flex items-center gap-3">
              <User className="size-4 shrink-0 text-muted-foreground" />
              {o.customer.name}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-muted-foreground" />
              <a
                href={`tel:${o.customer.phone}`}
                className="font-medium text-primary hover:underline"
              >
                <bdi>{o.customer.phone}</bdi>
              </a>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {o.deliveryArea && (
                  <span className="block font-medium">
                    {localized(o.deliveryArea, "name")}
                  </span>
                )}
                <bdi>{o.customer.address}</bdi>
              </span>
            </p>
            {o.customer.notes && (
              <p className="flex items-start gap-3 rounded-lg bg-secondary p-3 text-secondary-foreground">
                <MessageSquareText className="mt-0.5 size-4 shrink-0" />
                {o.customer.notes}
              </p>
            )}
            <a href={`tel:${o.customer.phone}`} className="btn-outline w-full">
              <Phone className="size-4" />
              {t("call")}
            </a>
          </section>
        </aside>
      </div>
    </>
  );
}
