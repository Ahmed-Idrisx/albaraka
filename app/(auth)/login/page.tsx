import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-50 p-6">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <Logo className="mb-6" withTagline />
        <h1 className="mb-1 font-display text-xl font-bold text-brand-900">
          دخول لوحة التحكم
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          هذه الصفحة لفريق المتجر فقط.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
