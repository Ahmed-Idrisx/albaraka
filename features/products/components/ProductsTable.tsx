"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import type { Product } from "@/lib/types";

interface ProductsTableProps {
  products: Product[];
  deleting: boolean;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, deleting, onDelete }: ProductsTableProps) {
  const t = useTranslations("dashboard.products");
  const common = useTranslations("common");
  const format = useFormat();
  const localized = useLocalized();

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
      <table className="table">
        <thead>
          <tr>
            <th>{t("product")}</th>
            <th>{t("category")}</th>
            <th>{t("price")}</th>
            <th>{t("stock")}</th>
            <th>{t("status")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="flex items-center gap-3">
                  <span className="photo-frame relative size-12 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain p-0.5"
                    />
                  </span>
                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="font-medium hover:text-primary"
                  >
                    {localized(p, "name")}
                  </Link>
                </div>
              </td>
              <td className="text-muted-foreground">
                {typeof p.category === "object" ? localized(p.category, "name") : "—"}
              </td>
              <td className="whitespace-nowrap">
                <span className="font-medium">
                  {format.price(p.discountPrice ?? p.price)}
                </span>
                <span className="text-muted-foreground"> / {localized(p, "unit")}</span>
                {p.discountPrice != null && (
                  <span className="block text-xs text-muted-foreground line-through">
                    {format.price(p.price)}
                  </span>
                )}
              </td>
              <td>
                <span
                  className={
                    p.stock === 0
                      ? "font-medium text-destructive"
                      : p.stock <= 5
                        ? "font-medium text-status-pending"
                        : ""
                  }
                >
                  {p.stock}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    p.isAvailable
                      ? "bg-status-delivered/15 text-status-delivered"
                      : "bg-status-cancelled/15 text-status-cancelled"
                  }`}
                >
                  {p.isAvailable ? t("available") : t("unavailable")}
                </span>
              </td>
              <td>
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm hover:bg-secondary"
                  >
                    <Pencil className="size-4" />
                    {common("edit")}
                  </Link>
                  <ConfirmButton
                    disabled={deleting}
                    onConfirm={() => onDelete(p.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
