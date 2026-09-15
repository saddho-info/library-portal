"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/label";

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
} as const;

export function Input({
  className,
  label,
  hint,
  error,
  size = "md",
  id,
  disabled,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const field = (
    <input
      id={inputId}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        "w-full rounded-md border border-input bg-card text-foreground shadow-sm transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );

  if (!label && !hint && !error) {
    return field;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      {field}
      {error ? (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
