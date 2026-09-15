import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export function InventorySkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <SkeletonTable rows={5} cols={5} />
    </div>
  );
}
