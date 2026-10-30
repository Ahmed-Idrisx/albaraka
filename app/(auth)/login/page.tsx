import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("metaTitle") };
}

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <div className="card w-full max-w-sm p-6">
        <Logo className="mb-6" />
        <h1 className="mb-1 text-xl font-bold">{t("title")}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>
        <LoginForm />
      </div>
      <LanguageSwitcher />
    </main>
  );
}
