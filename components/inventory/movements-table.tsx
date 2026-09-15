import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCopyNumber,
  formatDateTime,
  formatMovementType,
} from "@/lib/inventory/format";
import type { InventoryMovement } from "@/lib/inventory/types";

export function MovementsTable({
  movements,
}: {
  movements: InventoryMovement[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead>Copy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement) => (
          <TableRow key={movement.id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDateTime(movement.createdAt)}
            </TableCell>
            <TableCell>{formatMovementType(movement.type)}</TableCell>
            <TableCell className="text-right tabular-nums">
              {movement.quantity}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {movement.copy
                ? formatCopyNumber(movement.copy.copyNumber)
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
