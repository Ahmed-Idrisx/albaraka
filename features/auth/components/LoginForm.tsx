"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "@/features/auth/hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";

export function LoginForm() {
  const login = useLogin();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => login.mutateAsync(values))}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          aria-invalid={Boolean(form.formState.errors.email)}
          aria-describedby={
            form.formState.errors.email ? "email-error" : undefined
          }
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p id="email-error" role="alert" className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          كلمة المرور
        </label>
        <div className="relative" dir="ltr">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={Boolean(form.formState.errors.password)}
            aria-describedby={
              form.formState.errors.password ? "password-error" : undefined
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-16 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            {...form.register("password")}
          />
          <button
            type="button"
            aria-label={
              isPasswordVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            }
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            {isPasswordVisible ? "إخفاء" : "إظهار"}
          </button>
        </div>
        {form.formState.errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting || login.isPending}
        className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        {login.isPending ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
}
