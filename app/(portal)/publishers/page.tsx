import type { Metadata } from "next";
import { PageHeader } from "@/components/portal/page-header";
import {
  PublishersPagination,
  PublishersTable,
} from "@/components/publishers/publishers-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  getPublishers,
  getPublishersLibraryStats,
} from "@/lib/publishers/get-publishers";

export const metadata: Metadata = {
  title: "Publishers",
};

export default async function PublishersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const publishers = await getPublishers({
    page,
    limit: 20,
    search: search || undefined,
  });
  const statsById = await getPublishersLibraryStats(
    publishers.data.map((publisher) => publisher.id),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Publishers"
        description="Stock and sales for every publisher cleared to distribute to this library."
      />

      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            name="search"
            label="Search"
            placeholder="Publisher name"
            defaultValue={search}
          />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      {publishers.data.length === 0 ? (
        <EmptyState
          title={search ? "No matching publishers" : "No publishers yet"}
          description={
            search
              ? "Try a different publisher name."
              : "Publishers appear here once they are cleared to distribute to this library."
          }
        />
      ) : (
        <>
          <PublishersTable
            publishers={publishers.data}
            statsById={statsById}
          />
          <PublishersPagination meta={publishers.meta} query={{ search }} />
        </>
      )}
    </div>
  );
}
