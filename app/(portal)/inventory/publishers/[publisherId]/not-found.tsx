import Link from "next/link";
import { buttonClassName } from "@/components/ui/button-styles";
import { EmptyState } from "@/components/ui/empty-state";

export default function PublisherInventoryNotFound() {
  return (
    <EmptyState
      title="Publisher not found"
      description="This publisher does not distribute to your library or no longer exists."
      action={
        <Link href="/publishers" className={buttonClassName()}>
          Back to publishers
        </Link>
      }
    />
  );
}
