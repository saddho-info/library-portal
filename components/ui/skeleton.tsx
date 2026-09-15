import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SkeletonProps = ComponentProps<"div"> & {
  variant?: "text" | "circular" | "rectangular";
};

const variantClass = {
  text: "h-4 w-full rounded-md",
  circular: "size-8 rounded-full",
  rectangular: "h-24 w-full rounded-md",
} as const;

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-muted",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex gap-3 border-b border-border bg-muted/70 px-3 py-3">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="flex gap-3 border-b border-border px-3 py-3 last:border-0"
        >
          {Array.from({ length: cols }, (_, col) => (
            <Skeleton key={col} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
