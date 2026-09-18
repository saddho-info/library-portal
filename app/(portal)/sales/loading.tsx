import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function SalesLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Skeleton variant="rectangular" className="h-24" />
        <Skeleton variant="rectangular" className="h-24" />
        <Skeleton variant="rectangular" className="h-24" />
        <Skeleton variant="rectangular" className="h-24" />
      </div>
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}
