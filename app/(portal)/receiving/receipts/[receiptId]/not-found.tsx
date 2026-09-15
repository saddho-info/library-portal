import { EmptyState } from "@/components/ui/empty-state";

export default function ReceiptNotFound() {
  return (
    <EmptyState
      title="Receipt not found"
      description="This stock receipt is missing or belongs to another library."
    />
  );
}
