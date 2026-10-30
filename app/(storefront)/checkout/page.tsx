"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  MapPin,
  PackageSearch,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { cartApi, deliveryAreasApi, ordersApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useMounted } from "@/lib/useMounted";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useCart } from "@/store/cart";
import { useInstallPrompt } from "@/features/pwa/useInstallPrompt";
import { Loading } from "@/components/shared/States";
import { PageHeader } from "@/components/shared/PageHeader";
import { Select } from "@/components/shared/Select";
import { FormField } from "@/components/shared/FormField";
import {
  createCheckoutSchema,
  type CheckoutValues,
} from "@/features/checkout/checkoutSchema";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const validation = useTranslations("validation");
  const format = useFormat();
  const localized = useLocalized();
  const mounted = useMounted();
  const { lines, clear } = useCart();
  const [placed, setPlaced] = useState<{ orderNumber: string }>();

  const schema = useMemo(() => createCheckoutSchema(validation), [validation]);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", areaId: "", address: "", notes: "" },
  });
  const areaId = useWatch({ control, name: "areaId" });

  const areas = useQuery({
    queryKey: queryKeys.deliveryAreas(true),
    queryFn: () => deliveryAreasApi.list(true),
  });
  const cart = useQuery({
    queryKey: queryKeys.cart(lines, areaId),
    queryFn: () => cartApi.validate(lines, areaId || undefined),
    enabled: lines.length > 0,
    placeholderData: keepPreviousData,
  });

  const placeOrder = useMutation({
    mutationFn: ({ areaId, ...customer }: CheckoutValues) =>
      ordersApi.create({
        customer,
        items: lines,
        deliveryAreaId: areaId || undefined,
      }),
    onSuccess: (order) => {
      setPlaced(order);
      clear();
      window.scrollTo({ top: 0 });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const needsArea = (areas.data?.length ?? 0) > 0;
  // The area is only required once the shop has delivery areas, so it is
  // checked here rather than in the schema — on both valid and invalid submits.
  const areaMissing = (values: Partial<CheckoutValues>) => {
    if (needsArea && !values.areaId) {
      setError("areaId", { message: validation("areaRequired") });
      return true;
    }
    return false;
  };
  const onSubmit = handleSubmit(
    (values) => !areaMissing(values) && placeOrder.mutate(values),
    () => areaMissing({ areaId }),
  );

  if (!mounted) return <Loading />;
  if (placed) return <OrderPlaced orderNumber={placed.orderNumber} />;
  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-muted-foreground">{t("emptyCart")}</p>
        <Link href="/products" className="btn">
          {t("startShopping")}
        </Link>
      </div>
    );
  }

  const selectedArea = areas.data?.find((area) => area.id === areaId);

  return (
    <div className="space-y-8">
      <PageHeader title={t("title")} />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6">
          <p className="text-sm text-muted-foreground">{t("intro")}</p>

          <FormField
            htmlFor="name"
            label={t("name")}
            required
            error={errors.name?.message}
          >
            <input
              id="name"
              className="input"
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>

          <FormField
            htmlFor="phone"
            label={t("phone")}
            required
            hint={t("phoneHint")}
            error={errors.phone?.message}
          >
            {/* Digits always read left-to-right; in Arabic they line up on the right. */}
            <input
              id="phone"
              type="tel"
              dir="ltr"
              inputMode="numeric"
              className="input rtl:text-right"
              placeholder="01012345678"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
          </FormField>

          {needsArea && (
            <FormField
              htmlFor="areaId"
              label={t("area")}
              required
              hint={t("areaHint")}
              error={errors.areaId?.message}
            >
              <Controller
                control={control}
                name="areaId"
                render={({ field }) => (
                  <Select
                    id="areaId"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.areaId}
                    placeholder={t("areaPlaceholder")}
                    icon={<MapPin className="size-4" />}
                    options={(areas.data ?? []).map((area) => ({
                      value: area.id,
                      label: localized(area, "name"),
                      hint: format.price(area.price),
                    }))}
                  />
                )}
              />
            </FormField>
          )}

          <FormField
            htmlFor="address"
            label={t("address")}
            required
            error={errors.address?.message}
          >
            <textarea
              id="address"
              rows={3}
              className="input h-auto resize-none py-2.5"
              placeholder={t("addressPlaceholder")}
              autoComplete="street-address"
              aria-invalid={!!errors.address}
              {...register("address")}
            />
          </FormField>

          <FormField
            htmlFor="notes"
            label={t("notes")}
            error={errors.notes?.message}
          >
            <textarea
              id="notes"
              rows={2}
              className="input h-auto resize-none py-2.5"
              placeholder={t("notesPlaceholder")}
              {...register("notes")}
            />
          </FormField>

          <button
            className="btn h-12 w-full text-base"
            disabled={placeOrder.isPending || cart.data?.canCheckout === false}
          >
            {placeOrder.isPending
              ? t("submitting")
              : cart.data
                ? t("submitWithTotal", { total: format.price(cart.data.total) })
                : t("submit")}
          </button>
          {cart.data?.canCheckout === false && (
            <p className="text-center text-sm text-destructive">
              {t.rich("cartNeedsFix", {
                link: (chunks) => (
                  <Link href="/cart" className="underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}
        </form>

        <aside className="card space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">{t("summary")}</h2>

          <ul className="max-h-60 space-y-2 overflow-y-auto text-sm">
            {cart.data?.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {localized(item, "name")} × {item.quantity}
                </span>
                <span className="shrink-0">
                  {item.lineTotal != null && format.price(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t pt-4 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{cart.data && format.price(cart.data.subtotal)}</span>
            </p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("delivery")}
                {selectedArea && (
                  <span className="block text-xs">
                    {localized(selectedArea, "name")}
                  </span>
                )}
              </span>
              <span>
                {selectedArea || !needsArea
                  ? cart.data && format.price(cart.data.deliveryFee)
                  : t("chooseArea")}
              </span>
            </div>
          </div>

          <p className="flex items-baseline justify-between border-t pt-4">
            <span className="font-bold">{t("total")}</span>
            <span className="font-display text-2xl font-bold text-primary">
              {cart.data && format.price(cart.data.total)}
            </span>
          </p>

          <p className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
            <Wallet className="size-4" />
            {t("paymentMethod")}
          </p>

          <Link
            href="/cart"
            className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="size-4 ltr:rotate-180" />
            {t("editCart")}
          </Link>
        </aside>
      </div>
    </div>
  );
}

function OrderPlaced({ orderNumber }: { orderNumber: string }) {
  const t = useTranslations("checkout.placed");
  const install = useTranslations("install");
  const { install: installApp } = useInstallPrompt();

  return (
    <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center sm:p-10">
      <CheckCircle2
        className="mx-auto mb-5 size-16 text-primary"
        strokeWidth={1.5}
      />
      <h1 className="text-3xl font-extrabold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("text")}</p>

      <p className="mt-10 text-sm text-muted-foreground">{t("orderNumber")}</p>
      <p className="mt-2 font-mono text-2xl font-bold tracking-wider" dir="ltr">
        {orderNumber}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{t("keepNumber")}</p>

      <Link
        href={`/track?order=${orderNumber}`}
        className="btn mt-10 h-11 w-full"
      >
        <PackageSearch className="size-4" />
        {t("track")}
      </Link>
      <Link
        href="/products"
        className="mt-4 inline-block font-medium hover:text-primary"
      >
        {t("orderMore")}
      </Link>

      <div className="mt-8 border-t pt-6 text-start">
        <p className="font-bold">{install("title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {install("afterOrderText")}
        </p>
        <button className="btn mt-4 h-9" onClick={installApp}>
          <Download className="size-4" />
          {install("buttonLong")}
        </button>
      </div>
    </div>
  );
}
