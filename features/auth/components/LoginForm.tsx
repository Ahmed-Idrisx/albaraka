"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useLogin } from "@/features/auth/hooks/useAuth";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import { FormField } from "@/components/shared/FormField";

export function LoginForm() {
  const t = useTranslations("auth");
  const validation = useTranslations("validation");
  const login = useLogin();
  const schema = useMemo(() => createLoginSchema(validation), [validation]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) });

  return (
    <form
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="space-y-4"
      noValidate
    >
      <FormField htmlFor="email" label={t("email")} error={errors.email?.message}>
        <input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          className="input rtl:text-right"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField
        htmlFor="password"
        label={t("password")}
        error={errors.password?.message}
      >
        <input
          id="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          className="input rtl:text-right"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <button type="submit" disabled={login.isPending} className="btn w-full">
        {login.isPending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
