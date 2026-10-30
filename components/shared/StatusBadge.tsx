import { useTranslations } from "next-intl";
import { ORDER_STATUS_STYLES } from "@/constant/site";
import type { OrderStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations("orderStatus");
  return (
    <span className={`badge ${ORDER_STATUS_STYLES[status]}`}>
      {t(status)}
    </span>
  );
}
