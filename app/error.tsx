"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <Logo className="mb-8" />
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t("text")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="btn h-11" onClick={retry}>
          <RefreshCw className="size-4" />
          {t("retry")}
        </button>
        <Link href="/" className="btn-outline h-11">
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
