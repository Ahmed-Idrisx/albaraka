"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ordersApi } from "@/lib/api";
import type { OrderStatus } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";

/** The happy path an order walks through, shown as a progress line. */
const STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

function Track() {
  const t = useTranslations("track");
  const statuses = useTranslations("orderStatus");
  const locale = useLocale();
  const format = useFormat();
  const localized = useLocalized();
  const initial = useSearchParams().get("order") ?? "";
  const [input, setInput] = useState(initial);
  const [orderNumber, setOrderNumber] = useState(initial);
  const [inputError, setInputError] = useState("");

  const order = useQuery({
    // The language is part of the key so a "not found" message follows a language switch.
    queryKey: ["track", orderNumber, locale],
    queryFn: () => ordersApi.track(orderNumber),
    enabled: orderNumber.length > 0,
    retry: false,
  });

  const current = order.data ? STEPS.indexOf(order.data.status) : -1;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      <form
        className="card space-y-4 p-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const value = input.trim().toUpperCase();
          if (!value) {
            setInputError(t("numberRequired"));
            return;
          }
          setInputError("");
          setOrderNumber(value);
        }}
      >
        <div>
          <label className="label" htmlFor="order-number">
            {t("orderNumber")} <span className="text-destructive">*</span>
          </label>
          <input
            id="order-number"
            className="input h-11 rtl:text-right"
            dir="ltr"
            placeholder="AB-260807-0001"
            aria-invalid={!!inputError}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setInputError("");
            }}
          />
          {inputError ? (
            <p className="mt-2 text-xs text-destructive">{inputError}</p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("numberHint")}
            </p>
          )}
        </div>
        <button className="btn h-11 w-full" disabled={order.isFetching}>
          {order.isFetching ? t("searching") : t("submit")}
        </button>
      </form>

      {order.error && <ErrorState error={order.error} />}

      {order.data && (
        <div className="card space-y-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono font-bold tracking-wider" dir="ltr">
                {order.data.orderNumber}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {format.date(order.data.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.data.status} />
          </div>

          {order.data.status !== "cancelled" && (
            <ol className="grid grid-cols-5 border-y py-5 text-center text-xs">
              {STEPS.map((step, i) => {
                const done = i < current;
                const isCurrent = i === current;
                return (
                  <li key={step} className="relative space-y-2">
                    {/* Line joining this step to the next one. */}
                    {i < STEPS.length - 1 && (
                      <span
                        className={`absolute top-4.5 end-[-50%] start-[50%] h-0.5 ${
                          done ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                    <span
                      className={`relative mx-auto flex size-9 items-center justify-center rounded-full font-display font-bold ${
                        done || isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                    >
                      {done ? <Check className="size-4" /> : format.number(i + 1)}
                    </span>
                    <span
                      className={`block ${
                        isCurrent
                          ? "font-bold"
                          : done
                            ? ""
                            : "text-muted-foreground"
                      }`}
                    >
                      {statuses(step)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <ul className="space-y-2 text-sm">
            {order.data.items.map((item) => (
              <li key={item.product} className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  {localized(item, "name")} × {item.quantity}{" "}
                  {localized(item, "unit")}
                </span>
                <span>{format.price(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t pt-4 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">{t("delivery")}</span>
              <span>{format.price(order.data.deliveryFee)}</span>
            </p>
            <p className="flex items-baseline justify-between">
              <span className="text-base font-bold">{t("total")}</span>
              <span className="font-display text-xl font-bold text-primary">
                {format.price(order.data.total)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <Track />
    </Suspense>
  );
}
