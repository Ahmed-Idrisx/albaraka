import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DashboardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Shows a "back" link above the title. */
  back?: { href: string; label: string };
  /** Buttons on the end side (left in RTL). */
  action?: ReactNode;
}

/** The title row every dashboard page starts with. */
export function DashboardHeader({
  title,
  description,
  back,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="size-4 ltr:rotate-180" />
            {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex flex-wrap items-center gap-2">{action}</div>
      )}
    </div>
  );
}
