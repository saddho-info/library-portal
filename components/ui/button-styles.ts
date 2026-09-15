import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border border-border bg-card text-foreground shadow-sm hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  danger:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-9 gap-2 px-3.5 text-sm",
  lg: "h-11 gap-2 px-5 text-sm",
  icon: "size-9 p-0",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}
