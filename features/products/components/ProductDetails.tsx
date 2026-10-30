"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { ChevronLeft, ShoppingBasket, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { productsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useCart } from "@/store/cart";
import { NotFoundContent } from "@/components/shared/NotFoundContent";
import { ErrorState } from "@/components/shared/States";
import { QuantityStepper } from "@/components/store/QuantityStepper";

export function ProductDetails({ slug }: { slug: string }) {
  const decodedSlug = decodeURIComponent(slug);
  const t = useTranslations("product");
  const nav = useTranslations("nav");
  const format = useFormat();
  const localized = useLocalized();
  const router = useRouter();
  const add = useCart((state) => state.add);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isPending, error } = useQuery({
    queryKey: queryKeys.product(decodedSlug),
    queryFn: () => productsApi.bySlug(decodedSlug),
    // A missing product won't appear on a second try.
    retry: (count, err) =>
      !(isAxiosError(err) && err.response?.status === 404) && count < 1,
  });

  if (isPending) return <ProductPageSkeleton />;
  if (isAxiosError(error) && error.response?.status === 404) {
    return <NotFoundContent />;
  }
  if (error) return <ErrorState error={error} />;

  const name = localized(product, "name");
  const unit = localized(product, "unit");
  const description = localized(product, "description");
  const category =
    typeof product.category === "object" ? product.category : null;
  const price = product.discountPrice ?? product.price;
  const discount =
    product.discountPrice != null
      ? Math.round((1 - product.discountPrice / product.price) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <nav
        aria-label={t("breadcrumb")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          {nav("home")}
        </Link>
        {category && (
          <>
            <ChevronLeft className="size-4 ltr:rotate-180" />
            <Link
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="hover:text-foreground"
            >
              {localized(category, "name")}
            </Link>
          </>
        )}
        <ChevronLeft className="size-4 ltr:rotate-180" />
        <span className="font-medium text-foreground">{name}</span>
      </nav>

      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
        <div className="photo-frame relative aspect-square overflow-hidden rounded-3xl border">
          <Image
            src={product.image}
            alt={name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-contain p-6 ${product.isAvailable ? "" : "grayscale"}`}
          />
          {discount > 0 && product.isAvailable && (
            <span className="plu-sticker top-4 start-4 text-sm">
              {t("discount", { percent: discount })}
            </span>
          )}
        </div>

        <div className="md:pt-4">
          {category && (
            <span className="badge bg-secondary font-medium text-secondary-foreground">
              {localized(category, "name")}
            </span>
          )}
          <h1 className="mt-3 text-4xl font-extrabold">{name}</h1>

          <p className="mt-4 font-display text-3xl font-bold text-primary">
            {t("pricePerUnit", { price: format.price(price), unit })}
          </p>
          {discount > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t.rich("wasSaved", {
                price: format.price(product.price),
                saved: format.price(product.price - price),
                old: (chunks) => <span className="line-through">{chunks}</span>,
              })}
            </p>
          )}

          <p
            className={`mt-4 flex items-center gap-2 text-sm font-medium ${
              product.isAvailable ? "text-status-delivered" : "text-destructive"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                product.isAvailable ? "bg-status-delivered" : "bg-destructive"
              }`}
            />
            {product.isAvailable ? t("available") : t("unavailable")}
          </p>

          {description && (
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {product.isAvailable && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium">{t("quantity", { unit })}</p>
              <div className="flex flex-wrap items-center gap-3">
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                />
                <button
                  className="btn h-11 min-w-48 flex-1"
                  onClick={() => {
                    add(product.id, quantity);
                    toast.success(t("added", { name }), {
                      action: {
                        label: t("viewCart"),
                        onClick: () => router.push("/cart"),
                      },
                    });
                    setQuantity(1);
                  }}
                >
                  <ShoppingBasket className="size-5" />
                  {t("addToCartTotal", { total: format.price(price * quantity) })}
                </button>
              </div>
              {product.stock <= 5 && (
                <p className="text-xs text-status-pending">
                  {t("lowStock", { count: product.stock })}
                </p>
              )}
            </div>
          )}

          <hr className="my-6" />

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck className="size-4 text-primary" />
              {t("deliveryNote")}
            </li>
            <li className="flex items-center gap-3">
              <Wallet className="size-4 text-primary" />
              {t("paymentNote")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 pt-10 md:grid-cols-2 lg:gap-12">
      <div className="aspect-square rounded-3xl bg-muted" />
      <div className="space-y-4 md:pt-4">
        <div className="h-6 w-20 rounded-full bg-muted" />
        <div className="h-10 w-2/3 rounded bg-muted" />
        <div className="h-8 w-1/3 rounded bg-muted" />
        <div className="h-11 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}
