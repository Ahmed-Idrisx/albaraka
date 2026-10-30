"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { adminsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { FormField } from "@/components/shared/FormField";

/** Built with the current language's messages, so errors show in that language. */
const createAdminSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(2, t("adminNameRequired")),
    email: z.string().trim().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMin")),
  });
type AdminValues = z.infer<ReturnType<typeof createAdminSchema>>;

export function AdminForm() {
  const t = useTranslations("dashboard.admins");
  const validation = useTranslations("validation");
  const common = useTranslations("common");
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(() => createAdminSchema(validation), [validation]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminValues>({ resolver: zodResolver(schema) });

  const create = useMutation({
    mutationFn: adminsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins });
      toast.success(t("created"));
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <form
      noValidate
      className="card space-y-4 p-6 lg:sticky lg:top-6"
      onSubmit={handleSubmit((values) => create.mutate(values))}
    >
      <h2 className="flex items-center gap-2 font-bold">
        <UserPlus className="size-5 text-primary" />
        {t("newAdmin")}
      </h2>
      <FormField
        htmlFor="admin-name"
        label={t("name")}
        required
        error={errors.name?.message}
      >
        <input
          id="admin-name"
          className="input"
          placeholder={t("namePlaceholder")}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </FormField>
      <FormField
        htmlFor="admin-email"
        label={t("email")}
        required
        error={errors.email?.message}
      >
        <input
          id="admin-email"
          type="email"
          dir="ltr"
          className="input rtl:text-right"
          placeholder="name@example.com"
          autoComplete="off"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </FormField>
      <FormField
        htmlFor="admin-password"
        label={t("password")}
        required
        hint={t("passwordHint")}
        error={errors.password?.message}
      >
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            className="input ltr:pr-10 rtl:pl-10 rtl:text-right"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 end-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </FormField>
      <button className="btn w-full" disabled={create.isPending}>
        {create.isPending ? common("adding") : t("add")}
      </button>
    </form>
  );
}
