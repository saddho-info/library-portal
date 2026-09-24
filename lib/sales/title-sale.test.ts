import { describe, expect, it } from "vitest";
import {
  clampQuantity,
  computeTitleSaleTotals,
} from "@/lib/sales/title-sale";

describe("computeTitleSaleTotals", () => {
  it("applies a direct amount discount and splits cents across copies", () => {
    const totals = computeTitleSaleTotals({
      listPriceCents: 1000,
      quantity: 3,
      discountType: "amount",
      discountValue: 1.01,
    });

    expect(totals.subtotalCents).toBe(3000);
    expect(totals.discountCents).toBe(101);
    expect(totals.finalTotalCents).toBe(2899);
    expect(totals.unitPricesCents).toEqual([966, 966, 967]);
    expect(totals.unitPricesCents.reduce((a, b) => a + b, 0)).toBe(2899);
  });

  it("applies a percentage discount", () => {
    const totals = computeTitleSaleTotals({
      listPriceCents: 2000,
      quantity: 2,
      discountType: "percent",
      discountValue: 10,
    });

    expect(totals.subtotalCents).toBe(4000);
    expect(totals.discountCents).toBe(400);
    expect(totals.finalTotalCents).toBe(3600);
    expect(totals.unitPricesCents).toEqual([1800, 1800]);
  });

  it("never discounts below zero", () => {
    const totals = computeTitleSaleTotals({
      listPriceCents: 500,
      quantity: 1,
      discountType: "amount",
      discountValue: 20,
    });

    expect(totals.finalTotalCents).toBe(0);
    expect(totals.unitPricesCents).toEqual([0]);
  });
});

describe("clampQuantity", () => {
  it("caps at on-hand and the API max", () => {
    expect(clampQuantity(50, 8)).toBe(8);
    expect(clampQuantity(50, 100)).toBe(20);
    expect(clampQuantity(0, 5)).toBe(1);
  });
});
