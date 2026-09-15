import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

function DefaultIcon() {
  return (
    <svg
      className="size-6 text-muted-foreground"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M3 10h18M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
