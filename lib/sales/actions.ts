"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiServerFetch, readApiError } from "@/lib/api/server";
import { getCopies, getInventory } from "@/lib/inventory/get-inventory";
import { parseMoneyToCents } from "@/lib/sales/format";
import {
  clampQuantity,
  computeTitleSaleTotals,
  MAX_TITLE_SALE_QTY,
  type DiscountType,
} from "@/lib/sales/title-sale";
import type { FormState } from "@/lib/sales/types";

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function revalidateSales(id?: string) {
  revalidatePath("/sales");
  revalidatePath("/inventory");
  revalidatePath("/publishers");
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

export async function createTitleSaleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const editionId = emptyToUndefined(formData.get("editionId"));
  if (!editionId) {
    return {
      error: "Pick a title to sell.",
      fieldErrors: { editionId: "Title is required." },
    };
  }

  const quantityRaw = Number(formData.get("quantity"));
  if (!Number.isFinite(quantityRaw) || quantityRaw < 1) {
    return {
      error: "Enter a quantity of at least 1.",
      fieldErrors: { quantity: "Quantity must be at least 1." },
    };
  }

  const discountTypeRaw =
    emptyToUndefined(formData.get("discountType")) ?? "amount";
  const discountType: DiscountType =
    discountTypeRaw === "percent" ? "percent" : "amount";

  let discountValue = 0;
  if (discountType === "amount") {
    const amountRaw = emptyToUndefined(formData.get("discountAmount")) ?? "0";
    const cents = parseMoneyToCents(amountRaw);
    if (cents === null) {
      return {
        error: "Enter a valid discount amount.",
        fieldErrors: { discountAmount: "Use a dollar amount like 2.50." },
      };
    }
    discountValue = cents / 100;
  } else {
    const percentRaw = Number(formData.get("discountPercent") ?? 0);
    if (!Number.isFinite(percentRaw) || percentRaw < 0 || percentRaw > 100) {
      return {
        error: "Enter a percent between 0 and 100.",
        fieldErrors: { discountPercent: "Use 0–100." },
      };
    }
    discountValue = percentRaw;
  }

  const rollups = await getInventory({ editionId, limit: 1 });
  const rollup = rollups.data[0];
  if (!rollup) {
    return { error: "That title is not in this library's inventory." };
  }

  const onHand = rollup.libraryOnHand;
  if (onHand < 1) {
    return { error: "No copies of this title are on hand." };
  }

  if (quantityRaw > onHand) {
    return {
      error: `Only ${onHand} copies are on hand.`,
      fieldErrors: { quantity: `Max available is ${onHand}.` },
    };
  }
  if (quantityRaw > MAX_TITLE_SALE_QTY) {
    return {
      error: `You can sell at most ${MAX_TITLE_SALE_QTY} copies in one sale.`,
      fieldErrors: { quantity: `Max is ${MAX_TITLE_SALE_QTY}.` },
    };
  }

  const quantity = clampQuantity(quantityRaw, onHand);

  const copies = await getCopies({
    editionId,
    status: "IN_STOCK_LIBRARY",
    limit: quantity,
  });
  if (copies.data.length < quantity) {
    return {
      error: `Only ${copies.data.length} on-hand copies are available right now.`,
      fieldErrors: { quantity: "Reduce the quantity and try again." },
    };
  }

  const totals = computeTitleSaleTotals({
    listPriceCents: rollup.listPriceCents,
    quantity,
    discountType,
    discountValue,
  });

  const items = copies.data.slice(0, quantity).map((copy, index) => ({
    copyId: copy.id,
    unitPriceCents: totals.unitPricesCents[index] ?? 0,
  }));

  const response = await apiServerFetch("/api/v1/sales", {
    method: "POST",
    headers: { "Idempotency-Key": randomUUID() },
    body: JSON.stringify({
      notes: emptyToUndefined(formData.get("notes")),
      items,
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
