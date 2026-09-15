import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCount } from "@/lib/receiving/format";
import type { ReceiptSummary, ShipmentSummary } from "@/lib/receiving/types";

export function ReceivingKpis({
  shipments,
  receipts,
}: {
  shipments: ShipmentSummary;
  receipts: ReceiptSummary;
}) {
  return (
    <section
      aria-label="Receiving summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Kpi
        label="Inbound"
        value={shipments.dispatched + shipments.partiallyReceived}
        hint="Shipments waiting to be confirmed"
      />
      <Kpi
        label="In transit"
        value={shipments.copiesInTransit}
        hint="Copies not yet on library shelves"
      />
      <Kpi
        label="Received"
        value={receipts.confirmed}
        hint="Confirmed receipts"
      />
      <Kpi
        label="Copies received"
        value={receipts.copiesReceived}
        hint="Units moved onto on-hand stock"
      />
    </section>
  );
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">
          {formatCount(value)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
