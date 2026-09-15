export { formatCount, formatCopyNumber, formatBookFormat, formatIsbn13 } from "@/lib/inventory/format";

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatSaleDate(iso: string | null | undefined): string {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function dollarsFromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function parseMoneyToCents(raw: string): number | null {
  const trimmed = raw.trim().replace(/[^0-9.]/g, "");
  if (!trimmed) {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value * 100);
}
