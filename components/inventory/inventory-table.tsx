import Link from "next/link";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatBookFormat,
  formatCount,
  formatIsbn13,
} from "@/lib/inventory/format";
import type { InventoryRollup, PaginationMeta } from "@/lib/inventory/types";

export function InventoryTable({ rows }: { rows: InventoryRollup[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>ISBN</TableHead>
          <TableHead className="text-right">On hand</TableHead>
          <TableHead className="text-right">Sold</TableHead>
          <TableHead>Alert</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.editionId}>
            <TableCell>
              <Link
                href={`/inventory/${row.editionId}`}
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {row.book.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatBookFormat(row.format)}
                {row.editionTitle ? ` · ${row.editionTitle}` : ""}
              </p>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {formatIsbn13(row.isbn)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(row.libraryOnHand || row.totalOnHand)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(row.sold)}
            </TableCell>
            <TableCell>
              {row.isLowStock ? <StatusPill status="LOW_STOCK" /> : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function InventoryPagination({
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
    return `/inventory?${params.toString()}`;
  }

  return (
    <nav
      className="flex items-center justify-between text-sm text-muted-foreground"
      aria-label="Inventory pages"
    >
      <p>
        Page {meta.page} of {meta.totalPages} · {meta.total} editions
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
