"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { useFormat } from "@/i18n/useFormat";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { ConfirmButton } from "@/components/shared/ConfirmButton";
import type { Admin } from "@/lib/types";

interface AdminsTableProps {
  admins: Admin[];
  deleting: boolean;
  onDelete: (id: string) => void;
}

export function AdminsTable({ admins, deleting, onDelete }: AdminsTableProps) {
  const t = useTranslations("dashboard.admins");
  const format = useFormat();
  const me = useCurrentUser();

  return (
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
          {admins.map((admin) => (
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
                    disabled={deleting}
                    onConfirm={() => onDelete(admin.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
