"use client";

import { useFormatter } from "next-intl";

/**
 * Prices and dates in the current language: "٢٣٫٠٠ ج.م." in Arabic,
 * "EGP 23.00" in English.
 */
export function useFormat() {
  const format = useFormatter();

  return {
    price: (value: number) =>
      format.number(value, { style: "currency", currency: "EGP" }),
    number: (value: number) => format.number(value),
    date: (value: string | Date) =>
      format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "short" }),
    day: (value: string | Date) =>
      format.dateTime(new Date(value), { dateStyle: "medium" }),
    shortDay: (value: string | Date) =>
      format.dateTime(new Date(value), { day: "numeric", month: "short" }),
  };
}
