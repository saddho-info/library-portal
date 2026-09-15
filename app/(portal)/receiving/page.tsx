import type { Metadata } from "next";
import { PageHeader } from "@/components/portal/page-header";
import { InboundTable, ReceivingPagination } from "@/components/receiving/inbound-table";
import { ReceiptsTable } from "@/components/receiving/receipts-table";
import { ReceivingKpis } from "@/components/receiving/receiving-kpis";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  getInboundShipments,
  getReceiptSummary,
  getShipmentSummary,
  getStockReceipts,
} from "@/lib/receiving/get-receiving";

export const metadata: Metadata = {
  title: "Receiving",
};

export default async function ReceivingPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const [shipments, shipmentSummary, receipts, receiptSummary] =
    await Promise.all([
      getInboundShipments({ page, limit: 20, search: search || undefined }),
      getShipmentSummary(),
      getStockReceipts({ page: 1, limit: 10, search: search || undefined }),
      getReceiptSummary(),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Receiving"
        description="Review inbound publisher shipments, verify copies, and confirm stock onto shelves."
      />

      <ReceivingKpis shipments={shipmentSummary} receipts={receiptSummary} />

      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            name="search"
            label="Search"
            placeholder="Shipment or receipt code"
            defaultValue={search}
          />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Inbound shipments</h2>
        {shipments.data.length === 0 ? (
          <EmptyState
            title={search ? "No matching inbound shipments" : "Nothing in transit"}
            description={
              search
                ? "Try a different search."
                : "When a publisher dispatches stock to this library, shipments appear here for review, verify, and confirm."
            }
          />
        ) : (
          <>
            <InboundTable shipments={shipments.data} />
            <ReceivingPagination
              meta={shipments.meta}
              query={{ search }}
              basePath="/receiving"
            />
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Recent receipts</h2>
        {receipts.data.length === 0 ? (
          <EmptyState
            title="No receipts yet"
            description="Confirmed receipts are listed here after you finish the receiving stepper."
          />
        ) : (
          <ReceiptsTable receipts={receipts.data} />
        )}
      </section>
    </div>
  );
}
