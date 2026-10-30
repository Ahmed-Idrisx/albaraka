import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Search } from "lucide-react";
import { STORE_IMAGES } from "@/constant/images";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    // Breaks out of the page's centered column to span the whole window, and
    // fills the height left under the header (-mt-6 cancels the page's top padding).
    <section className="relative isolate -mt-6 ms-[calc(50%-50vw)] flex min-h-[calc(100dvh-4.25rem)] w-screen items-center overflow-hidden">
      <Image
        src={STORE_IMAGES.hero}
        placeholder="blur"
        alt={t("imageAlt")}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Darkens the side the text sits on (right in Arabic, left in English). */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black/75 via-black/45 to-black/10 ltr:bg-gradient-to-r" />

      <div className="mx-auto w-full max-w-6xl px-4 py-14 text-white">
        <div className="max-w-xl">
          <span className="badge bg-fruit-lemon/90 text-black">{t("badge")}</span>
          <h1 className="mt-4 text-3xl leading-tight font-extrabold sm:text-5xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
          <p className="mt-4 text-white/85 sm:text-lg">{t("subtitle")}</p>

          <form action="/products" className="mt-6 flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="search"
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="input h-11 ps-9 text-foreground"
              />
            </div>
            <button className="btn h-11">{t("search")}</button>
          </form>

          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white"
          >
            {t("browseAll")}
            <ArrowLeft className="size-4 ltr:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
