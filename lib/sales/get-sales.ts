import { redirect } from "next/navigation";
import { apiServerFetch, ApiError, readApiError } from "@/lib/api/server";
import type {
  Paginated,
  SaleDetail,
  SaleListItem,
  SaleListQuery,
  SaleSummary,
} from "@/lib/sales/types";

function searchParamsFrom(query: SaleListQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 20));
  if (query.search) {
    params.set("search", query.search);
  }
  if (query.editionId) {
    params.set("editionId", query.editionId);
  }
  return params.toString();
}

export async function getSales(
  query: SaleListQuery = {},
): Promise<Paginated<SaleListItem>> {
  const response = await apiServerFetch(
    `/api/v1/sales?${searchParamsFrom(query)}`,
  );

  if (response.status === 401) {
    redirect("/login");
  }
  if (!response.ok) {
    throw new ApiError(await readApiError(response), response.status);
  }

  const body = (await response.json()) as Paginated<SaleListItem>;
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Sales response was malformed.", 502);
  }
  return body;
}

export async function getSaleSummary(
  query: SaleListQuery = {},
): Promise<SaleSummary> {
  const response = await apiServerFetch(
    `/api/v1/sales/summary?${searchParamsFrom(query)}`,
  );
  if (response.status === 401) {
    redirect("/login");
  }
  if (!response.ok) {
    throw new ApiError(await readApiError(response), response.status);
  }
  return (await response.json()) as SaleSummary;
}

export async function getSale(id: string): Promise<SaleDetail> {
  const response = await apiServerFetch(`/api/v1/sales/${id}`);

  if (response.status === 401) {
    redirect("/login");
  }
  if (response.status === 404 || response.status === 403) {
    throw new ApiError("Sale not found.", 404);
  }
  if (!response.ok) {
    throw new ApiError(await readApiError(response), response.status);
  }

  return (await response.json()) as SaleDetail;
}
