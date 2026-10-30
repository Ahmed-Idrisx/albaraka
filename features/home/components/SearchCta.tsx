import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Search } from "lucide-react";

/** Closing card on the home page, pointing to the full filtered catalogue. */
export function SearchCta() {
  const t = useTranslations("home.searchCta");

  return (
    <section className="rounded-3xl border bg-card px-6 py-14 text-center">
      <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Search className="size-6" />
      </span>
      <h2 className="text-2xl font-extrabold sm:text-3xl">{t("title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("text")}</p>
      <Link href="/products" className="btn mt-6">
        {t("button")}
        <ArrowLeft className="size-4 ltr:rotate-180" />
      </Link>
    </section>
  );
}
