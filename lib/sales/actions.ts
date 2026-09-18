"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiServerFetch, readApiError } from "@/lib/api/server";
import { parseMoneyToCents } from "@/lib/sales/format";
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
