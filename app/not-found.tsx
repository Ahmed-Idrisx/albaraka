import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { NotFoundContent } from "@/components/shared/NotFoundContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("metaTitle"), robots: { index: false } };
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
