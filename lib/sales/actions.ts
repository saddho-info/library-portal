"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiServerFetch, readApiError } from "@/lib/api/server";
import {
  discountedUnitPriceCents,
  parseMoneyToCents,
  parsePercentToBasisPoints,
  type SaleDiscountType,
} from "@/lib/sales/format";
import type { FormState } from "@/lib/sales/types";

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function listPriceFromForm(formData: FormData): number | undefined {
  const raw = emptyToUndefined(formData.get("listPriceCents"));
  if (!raw || !/^\d+$/.test(raw)) {
    return undefined;
  }
  const cents = Number(raw);
  return Number.isSafeInteger(cents) ? cents : undefined;
}

function resolveDiscountedPrice(
  formData: FormData,
  enteredPriceCents: number | undefined,
): { unitPriceCents: number | undefined } | { error: FormState } {
  const discountRaw = emptyToUndefined(formData.get("discount"));
  if (!discountRaw) {
    return { unitPriceCents: enteredPriceCents };
  }

  const typeRaw = emptyToUndefined(formData.get("discountType")) ?? "amount";
  if (typeRaw !== "amount" && typeRaw !== "percent") {
    return {
      error: {
        error: "Choose a discount type.",
        fieldErrors: { discount: "Choose amount or percentage." },
      },
    };
  }
  const type: SaleDiscountType = typeRaw;

  const baseCents = enteredPriceCents ?? listPriceFromForm(formData);
  if (baseCents === undefined) {
    return {
      error: {
        error: "Enter a unit price before applying a discount.",
        fieldErrors: {
          unitPrice: "Unit price is required when a discount is set.",
        },
      },
    };
  }

  if (type === "amount") {
    const discountCents = parseMoneyToCents(discountRaw);
    if (discountCents === null) {
      return {
        error: {
          error: "Enter a valid discount.",
          fieldErrors: {
            discount: "Use a dollar amount like 2.50, or leave it blank.",
          },
        },
      };
    }
    if (discountCents > baseCents) {
      return {
        error: {
          error: "Discount amount cannot be more than the unit price.",
          fieldErrors: {
            discount: "Discount amount cannot be more than the unit price.",
          },
        },
      };
    }
    return {
      unitPriceCents: discountedUnitPriceCents({
        unitPriceCents: baseCents,
        type,
        value: discountCents,
      }),
    };
  }

  const basis = parsePercentToBasisPoints(discountRaw);
  if (basis === null) {
    return {
      error: {
        error: "Enter a valid discount.",
        fieldErrors: { discount: "Enter a percentage from 0 to 100." },
      },
    };
  }
  return {
    unitPriceCents: discountedUnitPriceCents({
      unitPriceCents: baseCents,
      type,
      value: basis,
    }),
  };
}

function revalidateSales(id?: string) {
  revalidatePath("/sales");
  revalidatePath("/inventory");
  if (id) {
    revalidatePath(`/sales/${id}`);
  }
}

export async function createSaleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const copyId = emptyToUndefined(formData.get("copyId"));
  const qrToken = emptyToUndefined(formData.get("qrToken"));

  if (!copyId && !qrToken) {
    return {
      error: "Enter a QR token or open a copy from inventory.",
      fieldErrors: { qrToken: "QR token or copy is required." },
    };
  }
  if (copyId && qrToken) {
    return { error: "Provide a QR token or a copy, not both." };
  }

  const priceRaw = emptyToUndefined(formData.get("unitPrice"));
  let unitPriceCents: number | undefined;
  if (priceRaw) {
    const parsed = parseMoneyToCents(priceRaw);
    if (parsed === null) {
      return {
        error: "Enter a valid price.",
        fieldErrors: { unitPrice: "Use a dollar amount like 24.99." },
      };
    }
    unitPriceCents = parsed;
  }

  const discountResult = resolveDiscountedPrice(formData, unitPriceCents);
  if ("error" in discountResult) {
    return discountResult.error;
  }
  unitPriceCents = discountResult.unitPriceCents;

  const response = await apiServerFetch("/api/v1/sales", {
    method: "POST",
    headers: { "Idempotency-Key": randomUUID() },
    body: JSON.stringify({
      notes: emptyToUndefined(formData.get("notes")),
      items: [
        {
          ...(copyId ? { copyId } : { qrToken }),
          ...(unitPriceCents !== undefined ? { unitPriceCents } : {}),
        },
      ],
    }),
  });

  if (response.status === 401) {
    redirect("/login");
  }
  if (!response.ok) {
    return { error: await readApiError(response) };
  }

  const created = (await response.json()) as { id: string };
  revalidateSales(created.id);
  redirect(`/sales/${created.id}?notice=sale_created`);
}
