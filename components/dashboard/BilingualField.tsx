"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface BilingualFieldProps {
  /** Base for the inputs' ids and form names: `name` → "name" and "nameEn". */
  name: string;
  label: string;
  defaultAr?: string;
  defaultEn?: string;
  placeholderAr?: string;
  placeholderEn?: string;
  /** The Arabic value is required; the English one is always optional. */
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  multiline?: boolean;
  /** For forms that read values from state instead of FormData. */
  onChangeAr?: (value: string) => void;
}

export function BilingualField({
  name,
  label,
  defaultAr,
  defaultEn,
  placeholderAr,
  placeholderEn,
  required,
  error,
  hint,
  multiline,
  onChangeAr,
}: BilingualFieldProps) {
  const t = useTranslations("dashboard.form");

  const field = (lang: "ar" | "en") => {
    const id = lang === "ar" ? name : `${name}En`;
    const props = {
      id,
      name: id,
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      defaultValue: lang === "ar" ? defaultAr : defaultEn,
      placeholder: lang === "ar" ? placeholderAr : placeholderEn,
      "aria-invalid": lang === "ar" && !!error,
      onChange:
        lang === "ar" && onChangeAr
          ? (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChangeAr(e.target.value)
          : undefined,
    };
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            {...props}
            rows={3}
            className="input h-auto resize-none py-2.5 pt-7"
          />
        ) : (
          <input {...props} className="input h-auto pt-6 pb-2" />
        )}
        {/* A small tag in the corner says which language goes in the box. */}
        <span
          dir={props.dir}
          className="pointer-events-none absolute top-1.5 inset-s-3 text-[10px] font-medium tracking-wide text-muted-foreground uppercase"
        >
          {lang === "ar" ? t("arabic") : t("english")}
        </span>
      </div>
    );
  };

  return (
    <fieldset>
      <legend className="label">
        {label} {required && <span className="text-destructive">*</span>}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {field("ar")}
        {field("en")}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {hint ?? t("englishOptional")}
        </p>
      )}
    </fieldset>
  );
}
