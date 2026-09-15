"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/label";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<ComponentProps<"select">, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options?: SelectOption[];
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "h-8 py-0 pr-8 pl-2.5 text-xs",
  md: "h-9 py-0 pr-9 pl-3 text-sm",
} as const;

export function Select({
  className,
  label,
  hint,
  error,
  placeholder,
  options,
  size = "md",
  id,
  disabled,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const field = (
    <div className="relative">
      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full appearance-none rounded-md border border-input bg-card text-foreground shadow-sm transition-colors",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
          error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
          sizeClass[size],
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          : children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  if (!label && !hint && !error) {
    return field;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <Label htmlFor={selectId}>{label}</Label> : null}
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
