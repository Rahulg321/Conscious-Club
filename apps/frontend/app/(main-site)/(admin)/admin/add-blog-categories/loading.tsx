import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const loading = () => {
  return (
    <div className="block-space big-container">
      {/* Navigation Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-9 w-80" />
        </div>
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Add Category Form Skeleton */}
      <div className="mb-12">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Skeleton className="h-7 w-56" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-[100px] w-full" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>

              {/* Submit Button */}
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Categories Section */}
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardContent className="flex gap-2 pt-3">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
