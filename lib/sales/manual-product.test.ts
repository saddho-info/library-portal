import { describe, expect, it } from "vitest";
import {
  productLookupTerm,
  resolveManualEditionId,
} from "@/lib/sales/manual-product";

describe("productLookupTerm", () => {
  it("strips hyphens from an ISBN-13", () => {
    expect(productLookupTerm("978-0-306-40615-7")).toBe("9780306406157");
  });

  it("keeps a title query as typed", () => {
    expect(productLookupTerm("  Silent Archive  ")).toBe("Silent Archive");
  });
});

describe("resolveManualEditionId", () => {
  it("selects the only match so the sale can continue", () => {
    expect(resolveManualEditionId(["ed_1"])).toBe("ed_1");
  });

  it("waits for a choice when several titles match", () => {
    expect(resolveManualEditionId(["ed_1", "ed_2"])).toBeUndefined();
  });

  it("uses the requested edition when it is in the matches", () => {
    expect(resolveManualEditionId(["ed_1", "ed_2"], "ed_2")).toBe("ed_2");
  });
});
