"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { adminsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";
import { useFormat } from "@/i18n/useFormat";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import { FormField } from "@/components/shared/FormField";
import { ErrorState, Loading } from "@/components/shared/States";

/** Built with the current language's messages, so errors show in that language. */
const createAdminSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(2, t("adminNameRequired")),
    email: z.string().trim().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMin")),
  });
type AdminValues = z.infer<ReturnType<typeof createAdminSchema>>;

/** Superadmin only — the API returns 403 for everyone else. */
export default function AdminsPage() {
  const t = useTranslations("dashboard.admins");
  const validation = useTranslations("validation");
  const common = useTranslations("common");
  const format = useFormat();
  const queryClient = useQueryClient();
  const me = useCurrentUser();
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(() => createAdminSchema(validation), [validation]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminValues>({ resolver: zodResolver(schema) });

  const admins = useQuery({
    queryKey: queryKeys.admins,
    queryFn: adminsApi.list,
  });

  const refresh = (message: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admins });
    toast.success(message);
  };
  const onError = (error: unknown) => toast.error(getErrorMessage(error));

  const create = useMutation({
    mutationFn: adminsApi.create,
    onSuccess: () => {
      refresh(t("created"));
      reset();
    },
    onError,
  });
  const remove = useMutation({
    mutationFn: adminsApi.remove,
    onSuccess: () => refresh(t("deleted")),
    onError,
  });

  return (
    <>
      <DashboardHeader title={t("title")} description={t("description")} />

      <div className="grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
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
            {/* The text is always left-to-right; the eye button sits on the
                line's end side, and the padding makes room for it. */}
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
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>
          <button className="btn w-full" disabled={create.isPending}>
            {create.isPending ? common("adding") : t("add")}
          </button>
        </form>

        <section>
          {admins.isPending && <Loading />}
          {admins.error && <ErrorState error={admins.error} />}
          {admins.data && (
            <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("account")}</th>
                    <th>{t("role")}</th>
                    <th>{t("addedOn")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {admins.data.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground">
                            {admin.name.trim().charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium">
                              {admin.name}
                              {admin.id === me.data?.id && (
                                <span className="ms-2 text-xs text-muted-foreground">
                                  {t("you")}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <bdi>{admin.email}</bdi>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {admin.role === "superadmin" ? (
                          <span className="badge gap-1 bg-fruit-citrus/15 text-fruit-citrus">
                            <ShieldCheck className="size-3.5" />
                            {t("owner")}
                          </span>
                        ) : (
                          <span className="badge bg-secondary text-secondary-foreground">
                            {t("admin")}
                          </span>
                        )}
                      </td>
                      <td className="text-muted-foreground">
                        {format.day(admin.createdAt)}
                      </td>
                      <td className="text-end">
                        {admin.role !== "superadmin" && (
                          <ConfirmButton
                            disabled={remove.isPending}
                            onConfirm={() => remove.mutate(admin.id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
