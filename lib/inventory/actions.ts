"use server";

import { redirect } from "next/navigation";
import { apiServerFetch, readApiError } from "@/lib/api/server";
import type { FormState, InventoryCopy } from "@/lib/inventory/types";

export async function lookupQrAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = String(formData.get("token") ?? "").trim();
  if (!token) {
    return {
      error: "Enter a QR token.",
      fieldErrors: { token: "Token is required." },
    };
  }

  const response = await apiServerFetch(
    `/api/v1/copies/by-qr/${encodeURIComponent(token)}`,
  );

  if (response.status === 401) {
    redirect("/login");
  }
  if (response.status === 404) {
    return { error: "No copy at this library matches that QR token." };
  }
  if (!response.ok) {
    return { error: await readApiError(response) };
  }

  const copy = (await response.json()) as InventoryCopy;
  redirect(`/inventory/copies/${copy.id}`);
}
