import Link from "next/link";
import { buttonClassName } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/empty-state";

export default function SaleNotFound() {
  return (
    <EmptyState
      title="Sale not found"
      description="This sale may belong to another library or no longer exists."
      action={
        <Link href="/sales" className={buttonClassName()}>
          Back to sales
        </Link>
      }
    />
  );
}
