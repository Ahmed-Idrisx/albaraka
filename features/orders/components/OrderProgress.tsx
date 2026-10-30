"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { OrderStatus } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";

/** The happy path an order walks through, shown as a progress line. */
const STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export function OrderProgress({ status }: { status: OrderStatus }) {
  const statuses = useTranslations("orderStatus");
  const format = useFormat();
  const current = STEPS.indexOf(status);

  return (
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
  );
}
