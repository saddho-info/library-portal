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

export type SaleDiscountType = "amount" | "percent";

/** Parses a percentage into basis points (10000 = 100%). Empty means 0. */
export function parsePercentToBasisPoints(raw: string): number | null {
  const cleaned = raw.trim().replace(/%/g, "");
  if (!cleaned) {
    return 0;
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    return null;
  }
  return Math.round(value * 100);
}

/**
 * Unit price after the chosen discount. Amount is cents off the unit price.
 * Percent is basis points off the unit price (10000 = 100%).
 */
export function discountedUnitPriceCents({
  unitPriceCents,
  type,
  value,
}: {
  unitPriceCents: number;
  type: SaleDiscountType;
  value: number;
}): number {
  if (value <= 0) {
    return unitPriceCents;
  }
  if (type === "amount") {
    const next = unitPriceCents - value;
    return next < 0 ? 0 : next;
  }
  const basis = value > 10000 ? 10000 : value;
  return Math.round((unitPriceCents * (10000 - basis)) / 10000);
}
