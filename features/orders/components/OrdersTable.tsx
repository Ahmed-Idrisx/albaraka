"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { OrderSummary } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Empty } from "@/components/shared/States";

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  const t = useTranslations("dashboard.orders");
  const payment = useTranslations("payment");
  const format = useFormat();
  const router = useRouter();
  if (orders.length === 0) return <Empty text={t("empty")} />;

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
      <table className="table">
        <thead>
          <tr>
            <th>{t("number")}</th>
            <th>{t("customer")}</th>
            <th>{t("total")}</th>
            <th>{t("status")}</th>
            <th>{t("payment")}</th>
            <th>{t("date")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            // The whole row opens the order. The order number stays a real link
            // so keyboard users and "open in new tab" still work.
            <tr
              key={order.id}
              className="cursor-pointer"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) return;
                router.push(`/dashboard/orders/${order.id}`);
              }}
            >
              <td>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="font-medium text-primary hover:underline"
                  dir="ltr"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td>
                <p className="font-medium">{order.customer.name}</p>
                {/* <bdi> keeps the number's digit order while it lines up with the name. */}
                <p className="text-xs text-muted-foreground">
                  <bdi>{order.customer.phone}</bdi>
                </p>
              </td>
              <td className="font-medium">{format.price(order.total)}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td>
                <span
                  className={`badge ${
                    order.paymentStatus === "paid"
                      ? "bg-status-delivered/15 text-status-delivered"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {payment(order.paymentStatus)}
                </span>
              </td>
              <td className="whitespace-nowrap text-muted-foreground">
                {format.date(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
