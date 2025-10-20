import { Skeleton } from "@/components/ui/skeleton";
import ProjectCardSkeleton from "@/components/skeletons/project-card-skeleton";
import ProfileCardSkeleton from "@/components/skeletons/profile-card-skeleton";

export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section Skeleton */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between">
          {/* Search Filter Skeleton */}
          <div className="flex-1 max-w-md">
            <Skeleton className="h-8 w-full" />
          </div>

          {/* Tabs Skeleton */}
          <div className="flex items-center space-x-6">
            <div className="flex space-x-1">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 block-space">
        {/* Count Display Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Content Grid Skeleton - Default to Projects View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  );
}

