"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(component: string) {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Dialog>`);
  }
  return ctx;
}

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const titleId = useId();
  const descriptionId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  );
}

export type DialogTriggerProps = ComponentProps<"button">;

export function DialogTrigger({
  className,
  type = "button",
  onClick,
  ...props
}: DialogTriggerProps) {
  const { setOpen } = useDialogContext("DialogTrigger");

  return (
    <button
      type={type}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(true);
        }
      }}
      {...props}
    />
  );
}

export type DialogContentProps = ComponentProps<"dialog"> & {
  showClose?: boolean;
};

export function DialogContent({
  className,
  children,
  showClose = true,
  onClose,
  onClick,
  ...props
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialogContext(
    "DialogContent",
  );
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open) {
      if (!node.open) {
        node.showModal();
      }
    } else if (node.open) {
      node.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={(event) => {
        onClose?.(event);
        setOpen(false);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
        "rounded-lg border border-border bg-card p-0 text-card-foreground shadow-dialog",
        "backdrop:bg-slate-900/45 dark:backdrop:bg-black/60",
        "open:flex open:flex-col",
        className,
      )}
      {...props}
    >
      {showClose ? (
        <button
          type="button"
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => setOpen(false)}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
      {children}
    </dialog>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 px-5 pt-5 pr-12 pb-3", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<"h2">) {
  const { titleId } = useDialogContext("DialogTitle");
  return (
    <h2
      id={titleId}
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  const { descriptionId } = useDialogContext("DialogDescription");
  return (
    <p
      id={descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-5 py-2", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-5 pt-3 pb-5 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function DialogClose({
  className,
  type = "button",
  onClick,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useDialogContext("DialogClose");

  return (
    <button
      type={type}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
}
