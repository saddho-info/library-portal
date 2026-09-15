import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
};

function AlertIcon() {
  return (
    <svg
      className="size-6 text-destructive"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M12 3l10 18H2L12 3z" strokeLinejoin="round" />
      <path d="M12 10v4" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertIcon />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
