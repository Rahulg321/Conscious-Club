import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DiscoverPageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-6" />

        <div className="mb-6">
          <Skeleton className="h-12 w-full max-w-2xl rounded-lg" />
        </div>

        <div className="flex gap-4 mb-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-16" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            {/* Project image */}
            <Skeleton className="h-48 w-full" />

            <div className="p-4">
              {/* Category tag */}
              <Skeleton className="h-6 w-32 mb-3 rounded-full" />

              {/* Project title */}
              <Skeleton className="h-5 w-24 mb-2" />

              {/* Creator name */}
              <Skeleton className="h-4 w-28 mb-3" />

              {/* Like count and heart icon */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
