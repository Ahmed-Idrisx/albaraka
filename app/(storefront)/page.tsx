"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { categoriesApi, productsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { Hero } from "@/features/home/components/Hero";
import { Features } from "@/features/home/components/Features";
import { PromoBanners } from "@/features/home/components/PromoBanners";
import { CategorySections } from "@/features/home/components/CategorySections";
import { CategoryGrid } from "@/features/categories/components/CategoryGrid";
import { InstallAppBanner } from "@/features/pwa/components/InstallAppBanner";
import { SearchCta } from "@/features/home/components/SearchCta";
import { Empty, ErrorState } from "@/components/shared/States";
import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";

export default function HomePage() {
  const t = useTranslations("home");
  const categories = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
  });
  const sections = useQuery({
    queryKey: queryKeys.home,
    queryFn: productsApi.home,
  });

  return (
    <div className="space-y-14">
      <Hero />
      <Features />

      {!!categories.data?.length && (
        <section id="categories">
          <h2 className="mb-4 text-xl font-bold">{t("shopByCategory")}</h2>
          <CategoryGrid categories={categories.data} />
        </section>
      )}

      <PromoBanners />
      <InstallAppBanner />

      {sections.isPending && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}
      {sections.error && <ErrorState error={sections.error} />}
      {sections.data?.length === 0 && <Empty text={t("noProducts")} />}
      {sections.data && <CategorySections sections={sections.data} />}

      <SearchCta />
    </div>
  );
}
