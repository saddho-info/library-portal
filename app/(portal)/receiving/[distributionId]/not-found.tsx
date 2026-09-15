import { EmptyState } from "@/components/ui/empty-state";

export default function ShipmentNotFound() {
  return (
    <EmptyState
      title="Shipment not found"
      description="This inbound shipment is missing or belongs to another library."
    />
  );
}
