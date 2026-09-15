import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { SalesKpis } from "@/components/sales/sales-kpis";
import { SalesPagination, SalesTable } from "@/components/sales/sales-table";
import { buttonClassName } from "@/components/ui/button-styles";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { getSaleSummary, getSales } from "@/lib/sales/get-sales";

export const metadata: Metadata = {
  title: "Sales",
};

export default async function LibrarySalesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const [summary, result] = await Promise.all([
    getSaleSummary({ search: search || undefined }),
    getSales({ page, limit: 20, search: search || undefined }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sales"
        description="Record counter sales by QR token or from an on-hand copy."
        actions={
          <Link href="/sales/new" className={buttonClassName()}>
            New sale
          </Link>
        }
      />

      <SalesKpis summary={summary} />

      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            name="search"
            label="Search"
            placeholder="Code, title, ISBN, or notes"
            defaultValue={search}
          />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState
          title={search ? "No matching sales" : "No sales yet"}
          description={
            search
              ? "Try a different search."
              : "Sell an on-hand copy by QR token or from the inventory copy page."
          }
          action={
            <Link href="/sales/new" className={buttonClassName()}>
              New sale
            </Link>
          }
        />
      ) : (
        <>
          <SalesTable sales={result.data} />
          <SalesPagination meta={result.meta} query={{ search }} />
        </>
      )}
    </div>
  );
}
