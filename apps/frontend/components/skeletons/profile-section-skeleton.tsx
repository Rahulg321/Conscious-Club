import { Skeleton } from "@/components/ui/skeleton";

const ProfileSectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-start mb-2 gap-4 mr-auto">
        <div className="flex flex-col md:items-start gap-4 md:gap-2 w-full rounded-lg pb-4 md:px-4 pt-2 mr-auto">
          <div className="flex flex-row justify-center items-start gap-4 md:gap-8 w-max rounded-lg md:px-8 mr-auto">
            {/* Profile Image Skeleton */}
            <div className="relative self-center">
              <div className="w-36 h-36 md:w-56 md:h-56 rounded-full border-4 border-gray-100 shadow-lg relative overflow-hidden">
                <Skeleton className="w-full h-full rounded-full" />
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="md:text-left my-auto w-full flex flex-col items-start justify-center">
              {/* Name Skeleton */}
              <Skeleton className="h-8 md:h-10 w-48 md:w-64 mb-2" />

              {/* Buttons Area Skeleton */}
              <div className="flex items-center gap-2 mb-2 w-full">
                <Skeleton className="h-9 w-24 md:w-32" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>

              {/* Location Skeleton */}
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-32 md:w-40" />
              </div>

              {/* Followers/Following Badges Skeleton */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start md:mb-4 mb-2">
                <Skeleton className="h-7 w-24 md:w-28 rounded-full" />
                <Skeleton className="h-7 w-24 md:w-28 rounded-full" />
              </div>

              {/* Discipline and Role Badges Skeleton */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Skeleton className="h-7 w-20 md:w-24 rounded-full" />
                <Skeleton className="h-7 w-24 md:w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="my-4">
        <Skeleton className="h-6 w-16 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSectionSkeleton;
