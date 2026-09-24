import { describe, expect, it } from "vitest";
import {
  discountedUnitPriceCents,
  parsePercentToBasisPoints,
} from "@/lib/sales/format";

describe("sale discounts", () => {
  it("subtracts an amount from the unit price", () => {
    expect(
      discountedUnitPriceCents({
        unitPriceCents: 2499,
        type: "amount",
        value: 250,
      }),
    ).toBe(2249);
  });

  it("takes a percentage off the unit price", () => {
    expect(parsePercentToBasisPoints("10")).toBe(1000);
    expect(
      discountedUnitPriceCents({
        unitPriceCents: 2499,
        type: "percent",
        value: 1000,
      }),
    ).toBe(2249);
  });

  it("rejects a percentage outside 0 to 100", () => {
    expect(parsePercentToBasisPoints("101")).toBeNull();
    expect(parsePercentToBasisPoints("")).toBe(0);
  });
});
