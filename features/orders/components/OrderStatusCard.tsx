"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { ORDER_STATUSES, ORDER_STATUS_BAR } from "@/constant/site";
import { Select } from "@/components/shared/Select";

/** The status an order normally moves to next, for the one-click button. */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

interface OrderStatusCardProps {
  order: Order;
  pending: boolean;
  onUpdate: (change: { status?: OrderStatus; payment?: PaymentStatus }) => void;
}

export function OrderStatusCard({
  order: o,
  pending,
  onUpdate,
}: OrderStatusCardProps) {
  const t = useTranslations("dashboard.order");
  const statuses = useTranslations("orderStatus");
  const payment = useTranslations("payment");
  const next = NEXT_STATUS[o.status];

  return (
    <section className="card space-y-4 p-6">
      <h2 className="font-bold">{t("status")}</h2>
      {next && (
        <button
          className="btn h-11 w-full"
          disabled={pending}
          onClick={() => onUpdate({ status: next })}
        >
          {t("moveTo", { status: statuses(next) })}
          <ArrowLeft className="size-4 ltr:rotate-180" />
        </button>
      )}
      <Select
        aria-label={t("status")}
        value={o.status}
        disabled={pending}
        icon={
          <span
            className={`block size-2.5 rounded-full ${ORDER_STATUS_BAR[o.status]}`}
          />
        }
        onChange={(status) =>
          status !== o.status && onUpdate({ status })
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
              disabled={pending}
              onClick={() =>
                value !== o.paymentStatus &&
                onUpdate({ payment: value })
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
  );
}
