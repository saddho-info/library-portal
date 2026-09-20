import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Domain statuses used across inventory, distribution, sales, and sync.
 * Keep this union identical in both web apps.
 */
export type StatusValue =
  | "IN_STOCK_PUBLISHER"
  | "IN_STOCK_LIBRARY"
  | "DISTRIBUTED"
  | "DISPATCHED"
  | "RECEIVED"
  | "PARTIAL"
  | "PARTIALLY_RECEIVED"
  | "SOLD"
  | "RETURNED"
  | "LOST"
  | "LOW_STOCK"
  | "PENDING"
  | "SYNCED"
  | "FAILED"
  | "CANCELLED"
  | "DRAFT"
  | "CONFIRMED";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const STATUS_META: Record<StatusValue, { label: string; tone: Tone }> = {
  IN_STOCK_PUBLISHER: { label: "In stock", tone: "success" },
  IN_STOCK_LIBRARY: { label: "In stock", tone: "success" },
  DISTRIBUTED: { label: "Distributed", tone: "info" },
  DISPATCHED: { label: "Dispatched", tone: "info" },
  RECEIVED: { label: "Received", tone: "success" },
  PARTIAL: { label: "Partial", tone: "warning" },
  PARTIALLY_RECEIVED: { label: "Partial", tone: "warning" },
  SOLD: { label: "Sold", tone: "brand" },
  RETURNED: { label: "Returned", tone: "neutral" },
  LOST: { label: "Lost", tone: "danger" },
  LOW_STOCK: { label: "Low stock", tone: "warning" },
  PENDING: { label: "Pending", tone: "warning" },
  SYNCED: { label: "Synced", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  DRAFT: { label: "Draft", tone: "neutral" },
  CONFIRMED: { label: "Confirmed", tone: "success" },
};

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

const dotClass: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  brand: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
};

export type StatusPillProps = Omit<ComponentProps<"span">, "children"> & {
  status: StatusValue | string | null | undefined;
  label?: string;
};

function getStatusMeta(status: unknown): { label: string; tone: Tone } {
  const normalized = typeof status === "string" ? status.trim() : "";
  const known = STATUS_META[normalized as StatusValue];
  if (known) {
    return known;
  }

  const fallbackLabel = normalized
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

  return {
    label: fallbackLabel || "Unknown",
    tone: "neutral",
  };
}

export function StatusPill({
  status,
  label,
  className,
  ...props
}: StatusPillProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClass[meta.tone],
        className,
      )}
      {...props}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", dotClass[meta.tone])}
        aria-hidden="true"
      />
      {label ?? meta.label}
    </span>
  );
}

export function getStatusLabel(
  status: StatusValue | string | null | undefined,
): string {
  return getStatusMeta(status).label;
}
