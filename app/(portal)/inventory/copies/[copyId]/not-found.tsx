import Link from "next/link";
import { buttonClassName } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/empty-state";

export default function InventoryCopyNotFound() {
  return (
    <EmptyState
      title="Copy not found"
      description="This copy is not available in your library inventory."
      action={
        <Link href="/inventory" className={buttonClassName()}>
          Back to inventory
        </Link>
      }
    />
  );
}
