import { useTranslations } from "next-intl";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pages, onChange }: PaginationProps) {
  const t = useTranslations("common");
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3 text-sm">
      <button
        className="btn-outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        {t("previous")}
      </button>
      <span className="text-muted-foreground">
        {t("pageOf", { page, pages })}
      </span>
      <button
        className="btn-outline"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        {t("next")}
      </button>
    </div>
  );
}
