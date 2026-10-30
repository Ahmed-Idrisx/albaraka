"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConfirmButtonProps {
  onConfirm: () => void;
  /** Text on the button before it is clicked. */
  children?: ReactNode;
  confirmLabel?: string;
  disabled?: boolean;
}

export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel,
  disabled,
}: ConfirmButtonProps) {
  const t = useTranslations("common");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!asking) return;
    const timer = setTimeout(() => setAsking(false), 4000);
    return () => clearTimeout(timer);
  }, [asking]);

  if (!asking) {
    return (
      <button
        type="button"
        className="btn-danger"
        disabled={disabled}
        onClick={() => setAsking(true)}
      >
        <Trash2 className="size-4" />
        {children ?? t("delete")}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        className="inline-flex h-9 items-center rounded-lg bg-destructive px-3 text-sm font-medium text-white transition hover:bg-destructive/90"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {confirmLabel ?? t("confirmDelete")}
      </button>
      <button
        type="button"
        className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-muted-foreground hover:bg-secondary"
        onClick={() => setAsking(false)}
      >
        {t("cancel")}
      </button>
    </span>
  );
}
