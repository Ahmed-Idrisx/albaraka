import type { OrderStatus } from "@/lib/types";

/** Labels are translation keys under "nav" (storefront) and "dashboard.nav". */
export const STORE_LINKS = [
  { href: "/", label: "home" },
  { href: "/products", label: "products" },
  { href: "/track", label: "track" },
  { href: "/delivery-areas", label: "deliveryAreas" },
  { href: "/about", label: "about" },
] as const;

export const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "overview", icon: "home" },
  { href: "/dashboard/orders", label: "orders", icon: "orders" },
  { href: "/dashboard/products", label: "products", icon: "products" },
  { href: "/dashboard/categories", label: "categories", icon: "categories" },
  { href: "/dashboard/delivery-areas", label: "deliveryAreas", icon: "delivery" },
  { href: "/dashboard/settings", label: "settings", icon: "settings" },
] as const;

/** In order; labels live under the "orderStatus" messages. */
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

/** Badge classes per status — built on the --color-status-* tokens, so dark mode follows. */
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-status-pending/15 text-status-pending",
  confirmed: "bg-status-confirmed/15 text-status-confirmed",
  preparing: "bg-status-preparing/15 text-status-preparing",
  out_for_delivery: "bg-status-delivering/15 text-status-delivering",
  delivered: "bg-status-delivered/15 text-status-delivered",
  cancelled: "bg-status-cancelled/15 text-status-cancelled",
};

/** Bar colour per status in the dashboard chart. */
export const ORDER_STATUS_BAR: Record<OrderStatus, string> = {
  pending: "bg-status-pending",
  confirmed: "bg-status-confirmed",
  preparing: "bg-status-preparing",
  out_for_delivery: "bg-status-delivering",
  delivered: "bg-status-delivered",
  cancelled: "bg-status-cancelled",
};
