export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

/** The cookie that remembers the visitor's language. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.includes(value as Locale);

export const directionOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");
