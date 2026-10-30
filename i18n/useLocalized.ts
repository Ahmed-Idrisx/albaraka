"use client";

import { useLocale } from "next-intl";

/**
 * Content the admin enters (product, category and area names…) is stored in
 * Arabic as `field` and in English as `fieldEn`. This picks the one for the
 * current language and falls back to Arabic when the English is empty.
 *
 *   const localized = useLocalized();
 *   localized(product, "name")  // product.nameEn in English, else product.name
 */
export function useLocalized() {
  const locale = useLocale();

  return <T extends object>(item: T, field: keyof T & string): string => {
    const record = item as Record<string, unknown>;
    const arabic = (record[field] as string | undefined) ?? "";
    if (locale !== "en") return arabic;
    return (record[`${field}En`] as string | undefined) || arabic;
  };
}
