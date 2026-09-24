import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  InventoryPagination,
  InventoryTable,
} from "@/components/inventory/inventory-table";
import { QrLookupForm } from "@/components/inventory/qr-lookup-form";
import { PageHeader } from "@/components/portal/page-header";
import {
  PublisherReceiptsTable,
  PublisherSalesTable,
  PublisherTitlesTable,
} from "@/components/publishers/publisher-workspace";
import { Button } from "@/components/ui/button";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/server";
import {
  getInventory,
  getInventorySummary,
} from "@/lib/inventory/get-inventory";
import { formatCount } from "@/lib/inventory/format";
import {
  getPublisher,
  getPublisherLibraryStats,
} from "@/lib/publishers/get-publishers";
import { getStockReceipts } from "@/lib/receiving/get-receiving";
import { getSaleSummary, getSales } from "@/lib/sales/get-sales";
import { formatMoney } from "@/lib/sales/format";

async function requirePublisher(publisherId: string) {
  return getPublisher(publisherId).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publisherId: string }>;
}): Promise<Metadata> {
  const { publisherId } = await params;
  try {
    const publisher = await getPublisher(publisherId);
    return { title: `${publisher.name} inventory` };
  } catch {
    return { title: "Publisher inventory" };
  }
}

export default async function PublisherInventoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ publisherId: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { publisherId } = await params;
  const query = await searchParams;
  const search = query.search?.trim() ?? "";
  const page = Math.max(1, Number(query.page) || 1);

  const publisher = await requirePublisher(publisherId);

  const emptySales = {
    data: [] as Awaited<ReturnType<typeof getSales>>["data"],
    meta: { page: 1, limit: 8, total: 0, totalPages: 0 },
  };
  const emptyReceipts = {
    data: [] as Awaited<ReturnType<typeof getStockReceipts>>["data"],
    meta: { page: 1, limit: 8, total: 0, totalPages: 0 },
  };
  const emptySaleSummary = { saleCount: 0, itemCount: 0, totalCents: 0 };

  const [summary, result, stats, sales, salesSummary, receipts, allTitles] =
    await Promise.all([
      getInventorySummary({ publisherId }),
      getInventory({
        page,
        limit: 20,
        search: search || undefined,
        publisherId,
      }),
      getPublisherLibraryStats(publisherId),
      getSales({ publisherId, page: 1, limit: 8 }).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 403) {
          return emptySales;
        }
        throw error;
      }),
      getSaleSummary({ publisherId, page: 1, limit: 1 }).catch(
        (error: unknown) => {
          if (error instanceof ApiError && error.status === 403) {
            return emptySaleSummary;
          }
          throw error;
        },
      ),
      getStockReceipts({
        publisherId,
        status: "CONFIRMED",
        page: 1,
        limit: 8,
      }).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 403) {
          return emptyReceipts;
        }
        throw error;
      }),
      getInventory({ publisherId, page: 1, limit: 100 }),
    ]);

  const inStock = allTitles.data.filter((row) => row.libraryOnHand > 0);
  const basePath = `/inventory/publishers/${publisherId}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={publisher.name}
        description="Stock on hand at this library. Copies arrive after a publisher distribution is received."
        actions={
          <Link
            href="/publishers"
            className={buttonClassName({ variant: "outline" })}
          >
            All publishers
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardDescription>On hand</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(summary.libraryOnHand)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>In transit</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(summary.inTransit)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sold</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(summary.sold)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Stored</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(stats.stored)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sales revenue</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatMoney(salesSummary.totalCents)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Identify a copy</CardTitle>
          <CardDescription>
            Paste a QR token to look up the matching unit at this library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QrLookupForm />
        </CardContent>
      </Card>

      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            name="search"
            label="Search"
            placeholder="Title, author, or ISBN"
            defaultValue={search}
          />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState
          title={search ? "No matching stock" : "No library stock yet"}
          description={
            search
              ? "Try a different title or ISBN."
              : "Inventory appears here after the publisher distributes copies and this library receives them."
          }
        />
      ) : (
        <>
          <InventoryTable rows={result.data} />
          <InventoryPagination
            meta={result.meta}
            query={{ search }}
            basePath={basePath}
          />
        </>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">In stock now</h2>
        {inStock.length === 0 ? (
          <EmptyState
            title="Nothing on the shelf"
            description="Titles with on-hand copies appear here."
          />
        ) : (
          <PublisherTitlesTable rows={inStock} showSellLink />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">All stored titles</h2>
        {allTitles.data.length === 0 ? (
          <EmptyState
            title="No titles stored yet"
            description="Every edition this library has received from this publisher appears here."
          />
        ) : (
          <PublisherTitlesTable rows={allTitles.data} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Recent sales</h2>
          <p className="text-sm text-muted-foreground">
            {formatMoney(salesSummary.totalCents)} ·{" "}
            {formatCount(salesSummary.saleCount)} sales
          </p>
        </div>
        {sales.data.length === 0 ? (
          <EmptyState
            title="No sales yet"
            description="Counter sales of this publisher's titles appear here."
          />
        ) : (
          <PublisherSalesTable sales={sales.data} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">When stored</h2>
        {receipts.data.length === 0 ? (
          <EmptyState
            title="No confirmed receipts"
            description="Confirmed inbound receipts from this publisher appear here."
          />
        ) : (
          <PublisherReceiptsTable receipts={receipts.data} />
        )}
      </section>
    </div>
  );
}
