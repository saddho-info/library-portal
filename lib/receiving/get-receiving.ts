import { redirect } from "next/navigation";
import { apiServerFetch, ApiError, readApiError } from "@/lib/api/server";
import type {
  Paginated,
  ReceiptSummary,
  Shipment,
  ShipmentSummary,
  StockReceipt,
} from "@/lib/receiving/types";

function searchParamsFrom(
  query: Record<string, string | number | boolean | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "" || value === "all" || value === false) {
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
  if (response.status === 404 || response.status === 403) {
    throw new ApiError(fallback, response.status === 403 ? 403 : 404);
  }
  if (!response.ok) {
    throw new ApiError(await readApiError(response), response.status);
  }
  return (await response.json()) as T;
}

export async function getInboundShipments(query: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<Paginated<Shipment>> {
  const qs = searchParamsFrom({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
    receivable: true,
  });
  const response = await apiServerFetch(`/api/v1/distributions?${qs}`);
  const body = await readJson<Paginated<Shipment>>(
    response,
    "Shipments not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Shipments response was malformed.", 502);
  }
  return body;
}

export async function getShipmentSummary(): Promise<ShipmentSummary> {
  const response = await apiServerFetch("/api/v1/distributions/summary");
  return readJson<ShipmentSummary>(response, "Shipment summary not found.");
}

export async function getShipment(id: string): Promise<Shipment> {
  const response = await apiServerFetch(`/api/v1/distributions/${id}`);
  return readJson<Shipment>(response, "Shipment not found.");
}

export async function getStockReceipts(query: {
  page?: number;
  limit?: number;
  search?: string;
  distributionId?: string;
} = {}): Promise<Paginated<StockReceipt>> {
  const qs = searchParamsFrom({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
    distributionId: query.distributionId,
  });
  const response = await apiServerFetch(`/api/v1/stock-receipts?${qs}`);
  const body = await readJson<Paginated<StockReceipt>>(
    response,
    "Receipts not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Receipts response was malformed.", 502);
  }
  return body;
}

export async function getReceiptSummary(): Promise<ReceiptSummary> {
  const response = await apiServerFetch("/api/v1/stock-receipts/summary");
  return readJson<ReceiptSummary>(response, "Receipt summary not found.");
}

export async function getStockReceipt(id: string): Promise<StockReceipt> {
  const response = await apiServerFetch(`/api/v1/stock-receipts/${id}`);
  return readJson<StockReceipt>(response, "Receipt not found.");
}
