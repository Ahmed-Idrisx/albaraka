export const STORE_LINKS = [
  { href: "/products", label: "كل المنتجات" },
  { href: "/track", label: "تتبع طلبك" },
  { href: "/delivery-areas", label: "مناطق التوصيل" },
  { href: "/about", label: "من نحن" },
] as const;

/** The header's own nav. Shared by the desktop bar and the mobile drawer. */
export const HEADER_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن البركة" },
  { href: "/#categories", label: "الأقسام" },
  { href: "/products", label: "كل المنتجات" },
  { href: "/delivery-areas", label: "مناطق التوصيل" },
  { href: "/track", label: "تتبع طلبك" },
] as const;

export const ORDER_STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  preparing: "تحت التجهيز",
  out_for_delivery: "في الطريق",
  delivered: "تم التسليم",
  cancelled: "ملغي",
} as const;

export const ORDER_STATUS_COLORS = {
  pending: "var(--color-status-pending)",
  confirmed: "var(--color-status-confirmed)",
  preparing: "var(--color-status-preparing)",
  out_for_delivery: "var(--color-status-delivering)",
  delivered: "var(--color-status-delivered)",
  cancelled: "var(--color-status-cancelled)",
} as const;

/** Tailwind classes per status — mirrors the --color-status-* tokens. */
export const ORDER_STATUS_STYLES = {
  pending: "bg-status-pending/15 text-status-pending border-status-pending/30",
  confirmed:
    "bg-status-confirmed/15 text-status-confirmed border-status-confirmed/30",
  preparing:
    "bg-status-preparing/15 text-status-preparing border-status-preparing/30",
  out_for_delivery:
    "bg-status-delivering/15 text-status-delivering border-status-delivering/30",
  delivered:
    "bg-status-delivered/15 text-status-delivered border-status-delivered/30",
  cancelled:
    "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
} as const;
