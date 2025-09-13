import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectCardSkeleton() {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 w-80">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4 mb-2" />

        {/* Tag skeleton */}
        <div className="mb-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
