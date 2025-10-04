import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="px-4 md:px-8 py-6">
      {/* Cover Image Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="w-full max-w-2xl aspect-video rounded-xl" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Project Info Card Skeleton */}
          <div className="rounded-xl border p-5 md:p-6 bg-card">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Project Details Card Skeleton */}
          <div className="mt-6 rounded-xl border p-5 md:p-6 bg-card">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions Skeleton */}
        <div>
          <div className="rounded-xl border p-5 md:p-6 bg-card flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
