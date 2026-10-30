"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Logo } from "@/components/shared/Logo";
import { Loading } from "@/components/shared/States";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const t = useTranslations("dashboard.nav");
  const router = useRouter();
  const user = useCurrentUser();
  const logout = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // The page cookie can outlive the API session; send them back to log in.
  useEffect(() => {
    if (user.isError) router.replace("/login");
  }, [user.isError, router]);

  if (!user.data) return <Loading />;

  const sidebar = (
    <Sidebar
      user={user.data}
      onLogout={() => logout.mutate()}
      onNavigate={() => setDrawerOpen(false)}
    />
  );

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop: fixed sidebar on the start side. */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
        {sidebar}
      </aside>

      {/* Mobile: top bar + slide-in drawer. */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-card px-4 py-2 lg:hidden">
        <button
          className="btn-ghost"
          onClick={() => setDrawerOpen(true)}
          aria-label={t("menu")}
        >
          <Menu className="size-5" />
        </button>
        <Logo />
      </header>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 w-72 shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
