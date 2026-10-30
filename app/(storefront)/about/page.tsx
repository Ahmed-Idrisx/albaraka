import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Banknote, Scale, Sunrise } from "lucide-react";
import { STORE_IMAGES } from "@/constant/images";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactCard } from "@/components/store/ContactCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("metaTitle") };
}

const STEPS = [
  { icon: Sunrise, key: "pick" },
  { icon: Scale, key: "weigh" },
  { icon: Banknote, key: "pay" },
] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const format = useFormatter();

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <PageHeader
          large
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t.rich("intro", {
            strong: (chunks) => (
              <strong className="text-foreground">{chunks}</strong>
            ),
          })}
        />
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-card">
          <Image
            src={STORE_IMAGES.vegetables}
            placeholder="blur"
            alt={t("imageAlt")}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section>
        <PageHeader
          eyebrow={t("stepsEyebrow")}
          title={t("stepsTitle")}
          className="mb-8"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, key }, i) => (
            <div key={key} className="card p-6">
              <div className="mb-6 flex items-start justify-between">
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold text-primary">
                  {format.number(i + 1)}
                </span>
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`steps.${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative rounded-3xl bg-secondary px-6 py-14 text-center">
        <span className="absolute -top-3 inset-e-6 rotate-6 rounded-full bg-fruit-lemon px-3 py-1 text-xs font-bold text-black shadow">
          {t("guaranteeBadge")}
        </span>
        <h2 className="mx-auto max-w-2xl text-2xl leading-relaxed font-extrabold sm:text-3xl">
          {t("guaranteeTitle")}
        </h2>
        <p className="mt-4 text-primary">{t("guaranteeText")}</p>
      </section>

      <ContactCard />

      <div className="text-center">
        <Link href="/products" className="btn">
          {t("startShopping")}
          <ArrowLeft className="size-4 ltr:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
