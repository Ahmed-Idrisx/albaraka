import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Small green label above the title, e.g. "About us". */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Shown on the end side (left in RTL), e.g. a sort menu. */
  action?: ReactNode;
  /** A bigger title for a page's opening section. */
  large?: boolean;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  large = false,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-sm font-bold text-primary">{eyebrow}</p>
        )}
        <h1
          className={`leading-tight font-extrabold ${
            large ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
          }`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`leading-relaxed text-muted-foreground ${
              large ? "mt-5 text-lg leading-loose" : "mt-2"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
