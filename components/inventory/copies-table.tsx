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
import { formatCopyNumber } from "@/lib/inventory/format";
import type { InventoryCopy } from "@/lib/inventory/types";

export function CopiesTable({ copies }: { copies: InventoryCopy[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Copy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>QR token</TableHead>
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
                {formatCopyNumber(copy.copyNumber)}
              </Link>
            </TableCell>
            <TableCell>
              <StatusPill status={copy.status} />
            </TableCell>
            <TableCell className="max-w-[12rem] truncate font-mono text-xs text-muted-foreground">
              {copy.qrToken ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
