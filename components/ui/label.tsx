import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type LabelProps = ComponentProps<"label">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
