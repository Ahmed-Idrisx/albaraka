"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowLeft, Banknote, Clock, MapPin, Truck } from "lucide-react";
import { deliveryAreasApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { PageHeader } from "@/components/shared/PageHeader";
import { Empty, ErrorState, Loading } from "@/components/shared/States";
import { ContactCard } from "@/components/store/ContactCard";

const FACTS = [
  { icon: Truck, key: "fast" },
  { icon: Banknote, key: "byArea" },
  { icon: Clock, key: "hours" },
] as const;

export default function DeliveryAreasPage() {
  const t = useTranslations("deliveryAreas");
  const format = useFormat();
  const localized = useLocalized();
  const { data, isPending, error } = useQuery({
    queryKey: queryKeys.deliveryAreas(true),
    queryFn: () => deliveryAreasApi.list(true),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-14">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {FACTS.map(({ icon: Icon, key }) => (
          <div key={key} className="card p-5">
            <Icon className="mb-4 size-5 text-primary" />
            <p className="font-bold">{t(`facts.${key}.title`)}</p>
            <p className="text-sm text-muted-foreground">
              {t(`facts.${key}.text`)}
            </p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-5 text-2xl font-extrabold">{t("listTitle")}</h2>
        {isPending && <Loading />}
        {error && <ErrorState error={error} />}
        {data?.length === 0 && <Empty text={t("empty")} />}
        <ul className="grid gap-3 sm:grid-cols-2">
          {data?.map((area) => (
            <li
              key={area.id}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card px-5 py-4"
            >
              <span className="flex items-center gap-2 font-bold">
                <MapPin className="size-4 text-primary" />
                {localized(area, "name")}
              </span>
              <span className="font-display font-bold text-primary">
                {format.price(area.price)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">{t("note")}</p>
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
