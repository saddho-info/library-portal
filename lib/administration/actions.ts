"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiServerFetch, readApiError } from "@/lib/api/server";
import type { FormState } from "@/lib/administration/types";

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function updateLibraryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const libraryId = emptyToUndefined(formData.get("libraryId"));
  if (!libraryId) {
    return { error: "Library is required." };
  }

  const name = emptyToUndefined(formData.get("name"));
  if (!name) {
    return {
      error: "Name is required.",
      fieldErrors: { name: "Enter the library name." },
    };
  }

  const email = emptyToUndefined(formData.get("email"));
  const phone = emptyToUndefined(formData.get("phone"));
  const address = emptyToUndefined(formData.get("address"));

  const response = await apiServerFetch(`/api/v1/libraries/${libraryId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(address ? { address } : {}),
    }),
  });

  if (response.status === 401) {
    redirect("/login");
  }
  if (!response.ok) {
    return { error: await readApiError(response) };
  }

  revalidatePath("/administration");
  redirect("/administration");
}

export async function createStaffAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = emptyToUndefined(formData.get("email"));
  const password = emptyToUndefined(formData.get("password"));
  const firstName = emptyToUndefined(formData.get("firstName"));
  const lastName = emptyToUndefined(formData.get("lastName"));
  const role = emptyToUndefined(formData.get("role")) ?? "LIBRARY_STAFF";

  if (!email || !password || !firstName || !lastName) {
    return { error: "Email, password, first name, and last name are required." };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
      fieldErrors: { password: "Use 8 or more characters." },
    };
  }
  if (role !== "LIBRARY_STAFF" && role !== "LIBRARY_ADMIN") {
    return { error: "Role must be library staff or library admin." };
  }

  const response = await apiServerFetch("/api/v1/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      role,
    }),
  });

  if (response.status === 401) {
    redirect("/login");
  }
  if (!response.ok) {
    return { error: await readApiError(response) };
  }

  revalidatePath("/administration");
  redirect("/administration");
}
