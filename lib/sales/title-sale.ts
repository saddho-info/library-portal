export const MAX_TITLE_SALE_QTY = 20;

export type DiscountType = "amount" | "percent";

export type TitleSaleTotals = {
  subtotalCents: number;
  discountCents: number;
  finalTotalCents: number;
  unitPricesCents: number[];
};

export function clampQuantity(quantity: number, onHand: number): number {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }
  return Math.min(Math.floor(quantity), onHand, MAX_TITLE_SALE_QTY);
}

export function computeTitleSaleTotals(input: {
  listPriceCents: number;
  quantity: number;
  discountType: DiscountType;
  discountValue: number;
}): TitleSaleTotals {
  const quantity = Math.max(1, Math.floor(input.quantity));
  const listPriceCents = Math.max(0, Math.round(input.listPriceCents));
  const subtotalCents = listPriceCents * quantity;

  let discountCents = 0;
  if (input.discountType === "amount") {
    discountCents = Math.max(0, Math.round(input.discountValue * 100));
  } else {
    const percent = Math.min(100, Math.max(0, input.discountValue));
    discountCents = Math.round((subtotalCents * percent) / 100);
  }

  discountCents = Math.min(discountCents, subtotalCents);
  const finalTotalCents = subtotalCents - discountCents;

  const base = Math.floor(finalTotalCents / quantity);
  const remainder = finalTotalCents - base * quantity;
  const unitPricesCents = Array.from({ length: quantity }, (_, index) =>
    index === quantity - 1 ? base + remainder : base,
  );

  return {
    subtotalCents,
    discountCents,
    finalTotalCents,
    unitPricesCents,
  };
}
