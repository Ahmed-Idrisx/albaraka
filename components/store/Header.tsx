"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, Search, ShoppingBasket, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { STORE_LINKS } from "@/constant/site";
import { useCartCount } from "@/store/cart";
import { useMounted } from "@/lib/useMounted";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const count = useCartCount();
  // The cart lives in localStorage, so its count is only known after mount.
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <button
          className="btn-ghost md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t("menu")}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Logo withTagline className="me-auto md:me-6" />

        <nav className="hidden flex-1 gap-1 text-sm md:flex">
          {STORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 transition-colors ${
                isActive(link.href)
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <Link href="/products" className="btn-ghost" aria-label={t("search")}>
          <Search className="size-5" />
        </Link>
        <LanguageSwitcher className="btn-ghost hidden w-auto px-2.5 sm:inline-flex" />
        <ThemeToggle />
        <Link href="/cart" className="btn relative px-3" aria-label={t("cart")}>
          <ShoppingBasket className="size-5" />
          <span className="hidden sm:inline">{t("cart")}</span>
          {mounted && count > 0 && (
            <span className="absolute -top-1.5 -start-1.5 flex size-5 items-center justify-center rounded-full bg-fruit-tomato text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      {menuOpen && (
        <nav className="border-t px-4 py-2 md:hidden">
          {STORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 ${
                isActive(link.href)
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : ""
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
          {/* On phones the language switch lives in the menu. */}
          <LanguageSwitcher className="mt-1 flex w-full items-center rounded-lg px-3 py-2.5 hover:bg-secondary sm:hidden" />
        </nav>
      )}
    </header>
  );
}
