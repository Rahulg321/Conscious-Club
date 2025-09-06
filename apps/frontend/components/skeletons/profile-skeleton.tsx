import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Background */}
      <div className="relative">
        {/* Background Image Skeleton */}
        <Skeleton className="h-48 md:h-64 w-full rounded-none" />

        {/* Profile Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Profile Photo */}
            <div className="relative">
              <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
              {/* Online Indicator */}
              <Skeleton className="absolute -top-1 -right-1 w-6 h-6 rounded-full" />
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 md:h-8 w-48 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </div>

            {/* Share Button */}
            <div className="md:self-start">
              <Skeleton className="h-9 w-20 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <Skeleton className="h-6 w-16 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Work Sample Section */}
        <div>
          <Skeleton className="h-6 w-24 mb-4" />

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="space-y-3 p-0">
                  {/* Portfolio Image */}
                  <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" />

                  {/* Portfolio Info */}
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-8" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
