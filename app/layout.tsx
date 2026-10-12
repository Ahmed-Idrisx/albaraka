import type { Metadata, Viewport } from "next";
import { Changa, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/providers/providers";

const changa = Changa({
  variable: "--font-changa",
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "البركة | خضار وفاكهة طازجة",
    template: "%s | البركة",
  },
  description:
    "خضار وفاكهة طازجة توصلك خلال ساعة. اطلب أونلاين والدفع عند الاستلام.",
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
    title: "البركة",
    statusBarStyle: "default",
  },
};

// Colours the browser's own chrome on mobile, so it follows the theme instead of
// leaving a green bar above a dark page.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2F6B3C" },
    { media: "(prefers-color-scheme: dark)", color: "#141a15" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${changa.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
