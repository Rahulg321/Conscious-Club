import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar skeleton */}
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            {/* Name and badge row */}
            <div className="flex items-center gap-3 mb-1">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-40 rounded-full" />
            </div>
            {/* Location skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="w-10 h-10 rounded-full mb-1" />
            <Skeleton className="h-3 w-6" />
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="group">
            <div className="relative overflow-hidden rounded-lg mb-3">
              {/* Portfolio image skeleton */}
              <Skeleton className="w-full h-48" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                {/* Project title skeleton */}
                <Skeleton className="h-5 w-20 mb-1" />
                {/* Project subtitle skeleton */}
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-1">
                {/* Heart icon skeleton */}
                <Skeleton className="w-4 h-4" />
                {/* Likes count skeleton */}
                <Skeleton className="h-4 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
