import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export function PublishersSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-16" />
      <SkeletonTable rows={5} cols={4} />
    </div>
  );
}
