"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { cartApi, deliveryAreasApi, ordersApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useMounted } from "@/lib/useMounted";
import { useFormat } from "@/i18n/useFormat";
import { useLocalized } from "@/i18n/useLocalized";
import { useCart } from "@/store/cart";
import { Loading } from "@/components/shared/States";
import { PageHeader } from "@/components/shared/PageHeader";
import { Select } from "@/components/shared/Select";
import { FormField } from "@/components/shared/FormField";
import { createCheckoutSchema, type CheckoutValues } from "@/features/checkout/checkoutSchema";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";
import { OrderPlaced } from "@/features/checkout/components/OrderPlaced";

export function Checkout() {
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

        <CheckoutSummary
          cart={cart.data}
          selectedArea={selectedArea}
          needsArea={needsArea}
        />
      </div>
    </div>
  );
}
