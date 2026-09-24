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
  formatCopyNumber,
  formatIsbn13,
} from "@/lib/inventory/format";
import type { InventoryCopy } from "@/lib/inventory/types";

export function CopiesTable({ copies }: { copies: InventoryCopy[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Copy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Library</TableHead>
          <TableHead>ISBN</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {copies.map((copy, index) => (
          <TableRow key={copy.id || `copy-${index}`}>
            <TableCell>
              <Link
                href={`/inventory/copies/${copy.id}`}
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {copy.edition.book.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatBookFormat(copy.edition.format)}
                {copy.edition.title ? ` · ${copy.edition.title}` : ""}
              </p>
            </TableCell>
            <TableCell className="tabular-nums">
              <Link
                href={`/inventory/copies/${copy.id}`}
                className="hover:text-primary hover:underline"
              >
                {formatCopyNumber(copy.copyNumber)}
              </Link>
            </TableCell>
            <TableCell>
              <StatusPill status={copy.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {copy.library?.name ?? "—"}
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {formatIsbn13(copy.edition.isbn)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
