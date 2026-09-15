import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCount,
  formatMoney,
  formatSaleDate,
} from "@/lib/sales/format";
import type { PaginationMeta, SaleListItem } from "@/lib/sales/types";

export function SalesTable({ sales }: { sales: SaleListItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sale</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((row) => {
          const first = row.items[0];
          return (
            <TableRow key={row.id}>
              <TableCell>
                <Link
                  href={`/sales/${row.id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline"
                >
                  {row.code}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {formatCount(row.itemCount)} cop
                  {row.itemCount === 1 ? "y" : "ies"}
                </p>
              </TableCell>
              <TableCell>
                {first ? (
                  <>
                    <p className="font-medium">{first.edition.book.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {first.edition.book.authors}
                    </p>
                  </>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(row.totalCents, row.currency)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatSaleDate(row.soldAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function SalesPagination({
  meta,
  query,
}: {
  meta: PaginationMeta;
  query: { search: string };
}) {
  if (meta.totalPages <= 1) {
    return null;
  }

  function href(page: number) {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    params.set("page", String(page));
    return `/sales?${params.toString()}`;
  }

  return (
    <nav
      className="flex items-center justify-between text-sm text-muted-foreground"
      aria-label="Sales list pages"
    >
      <p>
        Page {meta.page} of {meta.totalPages} · {meta.total} sales
      </p>
      <div className="flex gap-2">
        {meta.page > 1 ? (
          <Link href={href(meta.page - 1)} className="hover:text-foreground">
            Previous
          </Link>
        ) : (
          <span className="opacity-40">Previous</span>
        )}
        {meta.page < meta.totalPages ? (
          <Link href={href(meta.page + 1)} className="hover:text-foreground">
            Next
          </Link>
        ) : (
          <span className="opacity-40">Next</span>
        )}
      </div>
    </nav>
  );
}
