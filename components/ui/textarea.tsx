"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/label";

export type TextareaProps = ComponentProps<"textarea"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Textarea({
  className,
  label,
  hint,
  error,
  id,
  disabled,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const field = (
    <textarea
      id={textareaId}
      disabled={disabled}
      rows={rows}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        error &&
          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
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
      {label ? <Label htmlFor={textareaId}>{label}</Label> : null}
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
