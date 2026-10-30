"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { cartApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "@/store/cart";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { ErrorState } from "@/components/shared/States";
import { PageHeader } from "@/components/shared/PageHeader";
import { CartItem } from "@/features/cart/components/CartItem";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { CartSkeleton, EmptyCart } from "@/features/cart/components/CartStates";

export function Cart() {
  const t = useTranslations("cart");
  const mounted = useMounted();
  const { lines, clear } = useCart();

  const cart = useQuery({
    queryKey: queryKeys.cart(lines),
    queryFn: () => cartApi.validate(lines),
    enabled: lines.length > 0,
    placeholderData: keepPreviousData,
  });

  if (!mounted || (lines.length > 0 && cart.isPending)) return <CartSkeleton />;
  if (lines.length === 0) return <EmptyCart />;
  if (cart.error) return <ErrorState error={cart.error} />;

  const { items, subtotal, canCheckout } = cart.data!;
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        description={t("itemCount", { count })}
        action={
          <ConfirmButton onConfirm={clear} confirmLabel={t("confirmClear")}>
            {t("clear")}
          </ConfirmButton>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </ul>

        <CartSummary subtotal={subtotal} canCheckout={canCheckout} />
      </div>
    </div>
  );
}
