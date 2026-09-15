import Link from "next/link";
import { StatusPill, type StatusValue } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCount, formatShipmentDate } from "@/lib/receiving/format";
import type { PaginationMeta, Shipment } from "@/lib/receiving/types";

export function InboundTable({ shipments }: { shipments: Shipment[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shipment</TableHead>
          <TableHead>Publisher</TableHead>
          <TableHead className="text-right">Copies</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Dispatched</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <Link
                href={`/receiving/${row.id}`}
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {row.code}
              </Link>
              <p className="text-xs text-muted-foreground">
                {row.itemCount} edition{row.itemCount === 1 ? "" : "s"}
              </p>
            </TableCell>
            <TableCell>{row.publisher.name}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(row.totalQuantity)}
            </TableCell>
            <TableCell>
              <StatusPill status={row.status as StatusValue} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatShipmentDate(row.dispatchedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ReceivingPagination({
  meta,
  query,
  basePath,
}: {
  meta: PaginationMeta;
  query: { search: string };
  basePath: string;
}) {
  if (meta.totalPages <= 1) {
    return null;
  }

  function href(page: number) {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav
      className="flex items-center justify-between text-sm text-muted-foreground"
      aria-label="List pages"
    >
      <p>
        Page {meta.page} of {meta.totalPages} · {meta.total} rows
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
