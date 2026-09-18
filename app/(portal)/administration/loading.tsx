import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdministrationLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <SkeletonTable rows={5} cols={4} />
    </div>
  );
}
