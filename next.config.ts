import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at the file that picks the language and its messages.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // next/image re-encodes every photo as webp at the size actually shown.
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" }, // product & category photos
    ],
  },
};

export default withNextIntl(nextConfig);
