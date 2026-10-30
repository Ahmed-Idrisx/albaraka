import type { MetadataRoute } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { directionOf, type Locale } from "@/i18n/config";

/** The install manifest follows the visitor's language too. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("meta");

  return {
    // A stable id keeps the browser treating this as the same app across deploys.
    id: "/",
    name: t("title"),
    short_name: t("shortName"),
    description: t("manifestDescription"),
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#2F6B3C",
    dir: directionOf(locale),
    lang: locale,
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
