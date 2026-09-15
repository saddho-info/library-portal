import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"
  | "muted";

export type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-foreground/90 text-background",
  brand: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  outline: "border border-border bg-card text-foreground",
  muted: "bg-muted text-muted-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
