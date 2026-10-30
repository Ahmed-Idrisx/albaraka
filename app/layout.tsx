import type { Metadata, Viewport } from "next";
import { Changa, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Toaster } from "sonner";
import { Providers } from "@/providers/providers";
import { directionOf, type Locale } from "@/i18n/config";
import "./globals.css";

// Both fonts carry Latin letters too, so English uses the same type.
const changa = Changa({
  variable: "--font-changa",
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: { default: t("title"), template: `%s | ${t("shortName")}` },
    description: t("description"),
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/icons/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      title: t("shortName"),
      statusBarStyle: "default",
    },
  };
}

// Colours the browser's own chrome on mobile so it follows the theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2F6B3C" },
    { media: "(prefers-color-scheme: dark)", color: "#141a15" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = (await getLocale()) as Locale;
  const dir = directionOf(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${changa.variable} ${plexArabic.variable} antialiased`}
    >
      {/* Browser extensions (e.g. ClickUp) add classes to <body> before React
          loads; this keeps that from being reported as a hydration error. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster position="top-center" richColors dir={dir} />
      </body>
    </html>
  );
}
