import type { CopyStatus, MovementType } from "@/lib/inventory/types";

const COPY_LABELS: Record<CopyStatus, string> = {
  IN_STOCK_PUBLISHER: "Warehouse",
  DISTRIBUTED: "In transit",
  IN_STOCK_LIBRARY: "On hand",
  SOLD: "Sold",
  RETURNED: "Returned",
  LOST: "Lost",
};

const MOVEMENT_LABELS: Record<MovementType, string> = {
  PRINT_RECEIPT: "Print run",
  DISTRIBUTION: "Distributed",
  RECEIPT: "Received",
  SALE: "Sale",
  RETURN: "Return",
  ADJUSTMENT: "Adjustment",
  LOSS: "Loss",
};

const FORMAT_LABELS: Record<string, string> = {
  HARDCOVER: "Hardcover",
  PAPERBACK: "Paperback",
  MASS_MARKET: "Mass market",
  BOARD_BOOK: "Board book",
  OTHER: "Other",
};

export function formatCopyStatus(status: CopyStatus): string {
  return COPY_LABELS[status] ?? status;
}

export function formatMovementType(type: MovementType): string {
  return MOVEMENT_LABELS[type] ?? type;
}

export function formatCopyNumber(copyNumber: number): string {
  return `#${String(copyNumber).padStart(4, "0")}`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatBookFormat(format: string): string {
  return FORMAT_LABELS[format] ?? format;
}

export function formatIsbn13(digits: string): string {
  const compact = digits.replace(/[^0-9]/g, "");
  if (compact.length !== 13) {
    return digits;
  }
  return `${compact.slice(0, 3)}-${compact.slice(3, 12)}-${compact.slice(12)}`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
