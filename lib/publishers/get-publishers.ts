import { redirect } from "next/navigation";
import { apiServerFetch, ApiError, readApiError } from "@/lib/api/server";
import { getInventorySummary } from "@/lib/inventory/get-inventory";
import { getSaleSummary } from "@/lib/sales/get-sales";
import type {
  Paginated,
  Publisher,
  PublisherLibraryStats,
} from "@/lib/publishers/types";

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

export async function getPublishers(query: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
} = {}): Promise<Paginated<Publisher>> {
  const qs = searchParamsFrom({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
    isActive: query.isActive,
  });
  const response = await apiServerFetch(`/api/v1/publishers?${qs}`);
  const body = await readJson<Paginated<Publisher>>(
    response,
    "Publishers not found.",
  );
  if (!Array.isArray(body.data) || !body.meta) {
    throw new ApiError("Publishers response was malformed.", 502);
  }
  return body;
}

export async function getPublisher(id: string): Promise<Publisher> {
  const response = await apiServerFetch(`/api/v1/publishers/${id}`);
  return readJson<Publisher>(response, "Publisher not found.");
}

async function safeSaleSummary(publisherId: string) {
  try {
    return await getSaleSummary({ publisherId, page: 1, limit: 1 });
  } catch (error: unknown) {
    // Production API may still forbid library publisherId filters until the
    // backend role change is deployed; keep inventory stats visible.
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
      return { saleCount: 0, itemCount: 0, totalCents: 0 };
    }
    throw error;
  }
}

export async function getPublisherLibraryStats(
  publisherId: string,
): Promise<PublisherLibraryStats> {
  const [inventory, sales] = await Promise.all([
    getInventorySummary({ publisherId }),
    safeSaleSummary(publisherId),
  ]);

  return {
    publisherId,
    onHand: inventory.libraryOnHand,
    stored:
      inventory.libraryOnHand +
      inventory.sold +
      inventory.returned +
      inventory.lost,
    salesTotalCents: sales.totalCents,
    saleCount: sales.saleCount,
  };
}

export async function getPublishersLibraryStats(
  publisherIds: string[],
): Promise<Map<string, PublisherLibraryStats>> {
  const entries = await Promise.all(
    publisherIds.map(async (publisherId) => {
      try {
        const stats = await getPublisherLibraryStats(publisherId);
        return [publisherId, stats] as const;
      } catch {
        return [
          publisherId,
          {
            publisherId,
            onHand: 0,
            stored: 0,
            salesTotalCents: 0,
            saleCount: 0,
          },
        ] as const;
      }
    }),
  );
  return new Map(entries);
}
