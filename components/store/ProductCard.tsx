"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useCart } from "@/store/cart";

interface ProductCardProps {
  product: Product;
  /** For lists where the product's category isn't populated (home rows). */
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const t = useTranslations("product");
  const format = useFormat();
  const localized = useLocalized();
  const add = useCart((state) => state.add);

  const name = localized(product, "name");
  const unit = localized(product, "unit");
  const category =
    categoryName ??
    (typeof product.category === "object"
      ? localized(product.category, "name")
      : undefined);
  const discount =
    product.discountPrice != null
      ? Math.round((1 - product.discountPrice / product.price) * 100)
      : 0;

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link
        href={`/products/${product.slug}`}
        className="photo-frame relative mb-4 block aspect-[4/3] overflow-hidden rounded-xl"
      >
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
          className={`object-contain p-2 transition duration-300 group-hover:scale-105 ${
            product.isAvailable ? "" : "grayscale"
          }`}
        />
        {discount > 0 && product.isAvailable && (
          <span className="plu-sticker">{t("discount", { percent: discount })}</span>
        )}
        {!product.isAvailable && (
          <span className="badge absolute top-2 end-2 bg-black/85 px-3 py-1 font-bold text-white">
            {t("unavailableBadge")}
          </span>
        )}
      </Link>

      <Link
        href={`/products/${product.slug}`}
        className="line-clamp-1 font-display text-lg font-bold hover:text-primary"
      >
        {name}
      </Link>
      {category && (
        <p className="text-sm text-muted-foreground">{category}</p>
      )}

      <div className="mt-3 mb-4">
        <p className="font-display text-xl font-bold text-primary">
          {t("pricePerUnit", {
            price: format.price(product.discountPrice ?? product.price),
            unit,
          })}
        </p>
        {discount > 0 && (
          <p className="text-xs text-muted-foreground">
            {t.rich("was", {
              price: format.price(product.price),
              old: (chunks) => <span className="line-through">{chunks}</span>,
            })}
          </p>
        )}
      </div>

      <button
        className="btn mt-auto h-9 w-full"
        disabled={!product.isAvailable}
        onClick={() => {
          add(product.id);
          toast.success(t("added", { name }));
        }}
      >
        <ShoppingBasket className="size-4" />
        {t("addToCart")}
      </button>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
