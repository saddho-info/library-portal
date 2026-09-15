"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastItem = ToastInput & {
  id: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 7000,
};

let toastCount = 0;

function nextId() {
  toastCount += 1;
  return `toast-${toastCount}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId();
      const variant = input.variant ?? "info";
      const item: ToastItem = { ...input, id, variant };
      setToasts((current) => [...current, item]);
      const duration = input.duration ?? DEFAULT_DURATION[variant];
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}

const variantClass: Record<ToastVariant, string> = {
  success: "border-success/30",
  error: "border-destructive/30",
  warning: "border-warning/30",
  info: "border-info/30",
};

const iconClass: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-info",
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const className = cn("size-4 shrink-0", iconClass[variant]);
  if (variant === "success") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3l10 18H2L12 3z" strokeLinejoin="round" />
        <path d="M12 10v4" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.75" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed top-4 right-4 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          role={item.variant === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-toast",
            variantClass[item.variant],
          )}
        >
          <ToastIcon variant={item.variant} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{item.title}</p>
            {item.description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => onDismiss(item.id)}
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
