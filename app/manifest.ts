import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // A stable id keeps the browser treating this as the same app across deploys.
    id: "/",
    name: "البركة | خضار وفاكهة طازجة",
    short_name: "البركة",
    description: "اطلب خضار وفاكهة طازجة، والدفع عند الاستلام.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#2F6B3C",
    dir: "rtl",
    lang: "ar",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
