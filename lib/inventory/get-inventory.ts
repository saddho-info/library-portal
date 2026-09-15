import { redirect } from "next/navigation";
import { apiServerFetch, ApiError, readApiError } from "@/lib/api/server";
import type {
  InventoryCopy,
  InventoryMovement,
  InventoryRollup,
  InventorySummary,
  Paginated,
} from "@/lib/inventory/types";

function searchParamsFrom(
  query: Record<string, string | number | boolean | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "" || value === "all") {
      continue;
    }
    params.set(key, String(value));
  }
  return params.toString();
}

async function readJson<T>(response: Response, fallback: string): Promise<T> {
  if (response.status === 401) {
    redirect("/login");
  }
  if (response.status === 404) {
    throw new ApiError(fallback, 404);
  }
  if (!response.ok) {
    throw new ApiError(await readApiError(response), response.status);
  }
  return (await response.json()) as T;
}

export async function getInventory(query: {
  page?: number;
  limit?: number;
  search?: string;
  lowStock?: boolean;
  editionId?: string;
} = {}): Promise<Paginated<InventoryRollup>> {
  const qs = searchParamsFrom({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
    lowStock: query.lowStock,
    editionId: query.editionId,
  });
  const response = await apiServerFetch(`/api/v1/inventory?${qs}`);
  const body = await readJson<Paginated<InventoryRollup>>(
    response,
    "Inventory not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Inventory response was malformed.", 502);
  }
  return body;
}

export async function getInventorySummary(): Promise<InventorySummary> {
  const response = await apiServerFetch("/api/v1/inventory/summary");
  return readJson<InventorySummary>(response, "Inventory summary not found.");
}

export async function getCopies(query: {
  page?: number;
  limit?: number;
  editionId?: string;
  status?: string;
} = {}): Promise<Paginated<InventoryCopy>> {
  const qs = searchParamsFrom({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    editionId: query.editionId,
    status: query.status,
  });
  const response = await apiServerFetch(`/api/v1/copies?${qs}`);
  const body = await readJson<Paginated<InventoryCopy>>(
    response,
    "Copies not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Copies response was malformed.", 502);
  }
  return body;
}

export async function getCopy(
  id: string,
  includeQr = true,
): Promise<InventoryCopy> {
  const qs = includeQr ? "?includeQr=true" : "";
  const response = await apiServerFetch(`/api/v1/copies/${id}${qs}`);
  return readJson<InventoryCopy>(response, "Copy not found.");
}

export async function getMovements(query: {
  page?: number;
  limit?: number;
  editionId?: string;
  copyId?: string;
} = {}): Promise<Paginated<InventoryMovement>> {
  const qs = searchParamsFrom({
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    editionId: query.editionId,
    copyId: query.copyId,
  });
  const response = await apiServerFetch(`/api/v1/inventory/movements?${qs}`);
  const body = await readJson<Paginated<InventoryMovement>>(
    response,
    "Movements not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Movements response was malformed.", 502);
  }
  return body;
}
