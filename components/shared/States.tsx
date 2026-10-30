import { useTranslations } from "next-intl";
import { getErrorMessage } from "@/lib/apiClient";

/** The three states every data-driven page shows before its content. */

export function Loading() {
  const t = useTranslations("common");
  return (
    <p className="py-10 text-center text-muted-foreground">{t("loading")}</p>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-muted-foreground">{text}</p>;
}

export function ErrorState({ error }: { error: unknown }) {
  return (
    <p className="py-10 text-center text-destructive">{getErrorMessage(error)}</p>
  );
}
