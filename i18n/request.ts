import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";

/**
 * The language comes from the visitor's cookie. First-time visitors get English
 * only if their browser prefers it; everyone else starts in Arabic.
 * URLs stay the same in both languages.
 */
async function resolveLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const preferred = (await headers()).get("accept-language") ?? "";
  return preferred.toLowerCase().startsWith("en") ? "en" : DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "Africa/Cairo",
  };
});
