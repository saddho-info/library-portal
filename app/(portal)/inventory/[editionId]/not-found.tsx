import Link from "next/link";
import { buttonClassName } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/empty-state";

export default function InventoryEditionNotFound() {
  return (
    <EmptyState
      title="Edition not found"
      description="This edition is not in your library inventory or no longer exists."
      action={
        <Link href="/inventory" className={buttonClassName()}>
          Back to inventory
        </Link>
      }
    />
  );
}
