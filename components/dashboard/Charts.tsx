import type { OrderAnalytics } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { ORDER_STATUS_BAR } from "@/constant/site";
import { Empty } from "@/components/shared/States";

/*
 * Plain-CSS charts: bars are divs sized by percentage, so they need no chart
 * library and pick up the light/dark colours like everything else.
 */

/** Daily revenue as vertical bars, with the order count in each tooltip. */
export function RevenueChart({ daily }: { daily: OrderAnalytics["daily"] }) {
  const t = useTranslations("dashboard.overview");
  const format = useFormat();
  const max = Math.max(...daily.map((d) => d.revenue), 1);
  const total = daily.reduce((sum, d) => sum + d.revenue, 0);
  // Label every few bars so the axis never gets crowded.
  const labelEvery = Math.ceil(daily.length / 7);

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {t.rich("periodTotal", {
          total: format.price(total),
          b: (chunks) => (
            <span className="font-bold text-foreground">{chunks}</span>
          ),
        })}
      </p>
      <div className="flex h-48 items-end gap-1" dir="ltr">
        {daily.map((day) => (
          <div
            key={day.date}
            className="group relative flex h-full flex-1 flex-col justify-end"
          >
            <div
              className="min-h-0.5 rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
              style={{ height: `${(day.revenue / max) * 100}%` }}
            />
            <div className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-center text-xs whitespace-nowrap text-background group-hover:block">
              {format.shortDay(day.date)}
              <br />
              {format.price(day.revenue)} • {t("ordersCount", { count: day.orders })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground" dir="ltr">
        {daily.map((day, i) => (
          <span key={day.date} className="flex-1 text-center">
            {i % labelEvery === 0 ? format.shortDay(day.date) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** How many orders sit in each status, as horizontal bars. */
export function StatusChart({ byStatus }: { byStatus: OrderAnalytics["byStatus"] }) {
  const t = useTranslations("dashboard.overview");
  const statuses = useTranslations("orderStatus");
  if (byStatus.length === 0) return <Empty text={t("noOrdersYet")} />;
  const total = byStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <ul className="space-y-3">
      {byStatus.map(({ status, count }) => (
        <li key={status}>
          <div className="mb-1 flex justify-between text-sm">
            <span>{statuses(status)}</span>
            <span className="text-muted-foreground">{count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${ORDER_STATUS_BAR[status]}`}
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Best sellers by quantity. */
export function TopProducts({
  products,
}: {
  products: OrderAnalytics["topProducts"];
}) {
  const t = useTranslations("dashboard.overview");
  const format = useFormat();
  const localized = useLocalized();
  if (products.length === 0) return <Empty text={t("noSalesYet")} />;
  const max = Math.max(...products.map((p) => p.quantity), 1);

  return (
    <ol className="space-y-3">
      {products.map((product, i) => (
        <li key={product.name} className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex justify-between gap-2 text-sm">
              <span className="truncate">{localized(product, "name")}</span>
              <span className="shrink-0 text-muted-foreground">
                {format.number(product.quantity)} • {format.price(product.revenue)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-fruit-citrus"
                style={{ width: `${(product.quantity / max) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
