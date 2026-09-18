import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { ReceiptsTable } from "@/components/receiving/receipts-table";
import { SalesTable } from "@/components/sales/sales-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/empty-state";
import { canManageLibrary } from "@/lib/auth/display";
import { requireLibrarySession } from "@/lib/auth/session";
import { getInventorySummary } from "@/lib/inventory/get-inventory";
import { formatCount } from "@/lib/inventory/format";
import { getReceiptSummary, getStockReceipts } from "@/lib/receiving/get-receiving";
import { formatMoney } from "@/lib/sales/format";
import { getSaleSummary, getSales } from "@/lib/sales/get-sales";

export const metadata: Metadata = {
  title: "Reports",
};

const BASE_EXPORTS = [
  {
    kind: "sales.csv",
    label: "Sales CSV",
    description: "Counter sales with title, ISBN, and copy number.",
  },
  {
    kind: "sales.pdf",
    label: "Sales PDF",
    description: "Printable sales summary.",
  },
  {
    kind: "inventory.csv",
    label: "Inventory CSV",
    description: "On-hand, in-transit, and sold counts by edition.",
  },
  {
    kind: "inventory.pdf",
    label: "Inventory PDF",
    description: "Printable inventory rollup.",
  },
  {
    kind: "receipts.csv",
    label: "Receipts CSV",
    description: "Inbound shipment receipts and discrepancies.",
  },
  {
    kind: "receipts.pdf",
    label: "Receipts PDF",
    description: "Printable receiving activity.",
  },
] as const;

const AUDIT_EXPORTS = [
  {
    kind: "audit-logs.csv",
    label: "Audit CSV",
    description: "Mutating actions by library staff.",
  },
  {
    kind: "audit-logs.pdf",
    label: "Audit PDF",
    description: "Printable audit trail excerpt.",
  },
] as const;

export default async function ReportsPage() {
  const user = await requireLibrarySession();
  const showAudit = canManageLibrary(user.role);
  const exports = showAudit
    ? [...BASE_EXPORTS, ...AUDIT_EXPORTS]
    : [...BASE_EXPORTS];

  const [inventory, salesSummary, receiptSummary, recentSales, recentReceipts] =
    await Promise.all([
      getInventorySummary(),
      getSaleSummary(),
      getReceiptSummary(),
      getSales({ page: 1, limit: 8 }),
      getStockReceipts({ page: 1, limit: 8 }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Snapshot of on-hand stock, counter sales, and receiving — plus CSV/PDF exports."
      />

      <section
        aria-label="Library totals"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Kpi
          label="On hand"
          value={formatCount(inventory.libraryOnHand)}
          hint="Copies on library shelves"
        />
        <Kpi
          label="In transit"
          value={formatCount(inventory.inTransit)}
          hint="Dispatched, not yet received"
        />
        <Kpi
          label="Sales"
          value={formatCount(salesSummary.saleCount)}
          hint={formatMoney(salesSummary.totalCents)}
        />
        <Kpi
          label="Copies received"
          value={formatCount(receiptSummary.copiesReceived)}
          hint={`${formatCount(receiptSummary.confirmed)} receipts`}
        />
      </section>

      <section
        aria-label="Export reports"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {exports.map((item) => (
          <Card key={item.kind}>
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/api/reports/${item.kind}`}
                className={buttonClassName({ variant: "outline", size: "sm" })}
                prefetch={false}
              >
                Download
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent sales</h2>
          <Link href="/sales" className={buttonClassName({ variant: "ghost", size: "sm" })}>
            View sales
          </Link>
        </div>
        {recentSales.data.length === 0 ? (
          <EmptyState
            title="No sales in this period"
            description="Counter sales appear here after a copy is sold."
          />
        ) : (
          <SalesTable sales={recentSales.data} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent receipts</h2>
          <Link
            href="/receiving"
            className={buttonClassName({ variant: "ghost", size: "sm" })}
          >
            View receiving
          </Link>
        </div>
        {recentReceipts.data.length === 0 ? (
          <EmptyState
            title="No receipts yet"
            description="Confirmed inbound shipments appear here."
          />
        ) : (
          <ReceiptsTable receipts={recentReceipts.data} />
        )}
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
