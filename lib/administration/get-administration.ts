import { redirect } from "next/navigation";
import { apiServerFetch, ApiError, readApiError } from "@/lib/api/server";
import type { Paginated } from "@/lib/sales/types";
import type { LibraryProfile, StaffUser } from "@/lib/administration/types";

async function readJson<T>(response: Response, fallback: string): Promise<T> {
  if (response.status === 401) {
    redirect("/login");
  }
  if (response.status === 404 || response.status === 403) {
    throw new ApiError(fallback, 404);
  }
  if (!response.ok) {
    throw new ApiError(await readApiError(response), response.status);
  }
  return (await response.json()) as T;
}

export async function getLibrary(id: string): Promise<LibraryProfile> {
  const response = await apiServerFetch(`/api/v1/libraries/${id}`);
  return readJson<LibraryProfile>(response, "Library not found.");
}

export async function getStaff(query: {
  page?: number;
  limit?: number;
} = {}): Promise<Paginated<StaffUser>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 50));
  const response = await apiServerFetch(`/api/v1/users?${params.toString()}`);
  const body = await readJson<Paginated<StaffUser>>(
    response,
    "Staff not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Staff response was malformed.", 502);
  }
  return body;
}
