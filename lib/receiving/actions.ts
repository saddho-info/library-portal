"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiServerFetch, readApiError } from "@/lib/api/server";
import type { FormState, ReceiptDiscrepancy } from "@/lib/receiving/types";

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function confirmReceiptAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const distributionId = emptyToUndefined(formData.get("distributionId"));
  if (!distributionId) {
    return { error: "Shipment is required." };
  }

  const copyIds = formData.getAll("copyId").filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
  if (copyIds.length === 0) {
    return { error: "Select at least one copy on this shipment." };
  }

  const items = copyIds.map((copyId) => {
    const received = formData.get(`received:${copyId}`) === "on";
    const discrepancyRaw = emptyToUndefined(
      formData.get(`discrepancy:${copyId}`),
    );
    const discrepancy = (
      discrepancyRaw === "MISSING" || discrepancyRaw === "DAMAGED"
        ? discrepancyRaw
        : "NONE"
    ) as ReceiptDiscrepancy;
    return {
      copyId,
      received,
      discrepancy: received ? discrepancy : discrepancy === "NONE" ? "MISSING" : discrepancy,
      notes: emptyToUndefined(formData.get(`notes:${copyId}`)),
    };
  });

  if (!items.some((item) => item.received)) {
    return { error: "Confirm at least one copy as received." };
  }

  const response = await apiServerFetch("/api/v1/stock-receipts", {
    method: "POST",
    headers: { "Idempotency-Key": randomUUID() },
    body: JSON.stringify({
      distributionId,
      confirm: true,
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
  revalidatePath("/receiving");
  revalidatePath("/inventory");
  revalidatePath(`/receiving/${distributionId}`);
  redirect(`/receiving/receipts/${created.id}`);
}
