"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { DASHBOARD_LINKS } from "@/constant/site";
import type { AuthUser } from "@/lib/types";

const ICONS = {
  home: LayoutDashboard,
  orders: ShoppingBag,
  products: Package,
  categories: Tags,
  delivery: Truck,
  settings: Settings,
  admins: Users,
};

interface SidebarProps {
  user: AuthUser;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ user, onLogout, onNavigate }: SidebarProps) {
  const t = useTranslations("dashboard.nav");
  const pathname = usePathname();

  const links = [
    ...DASHBOARD_LINKS,
    ...(user.role === "superadmin"
      ? [{ href: "/dashboard/admins", label: "admins", icon: "admins" } as const]
      : []),
  ];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border p-4">
        <Logo tone="light" withTagline />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((link) => {
          const Icon = ICONS[link.icon];
          const active =
            link.href === "/dashboard"
              ? pathname === link.href
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-white font-medium text-brand-700 dark:bg-sidebar-accent dark:text-white"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="size-4" />
              {t(link.label)}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border p-3 text-sm">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-sidebar-accent"
        >
          <Store className="size-4" />
          {t("viewStore")}
        </Link>
        <LanguageSwitcher className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-sidebar-accent" />
        <div className="flex items-center gap-2 px-3 pt-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{user.name}</p>
            <p className="truncate text-xs opacity-70">
              {user.role === "superadmin" ? t("owner") : t("admin")}
            </p>
          </div>
          <ThemeToggle className="btn-ghost hover:bg-sidebar-accent" />
          <button
            className="btn-ghost hover:bg-sidebar-accent"
            onClick={onLogout}
            aria-label={t("logout")}
            title={t("logout")}
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
