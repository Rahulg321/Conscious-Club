import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const loading = () => {
  return (
    <div className="block-space big-container">
      {/* Navigation skeleton */}
      <div className="mb-6">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-9 w-64" />
        </div>
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Form skeleton */}
      <div className="mb-12">
        <Card className="w-full max-w-5xl">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Tabs skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Form fields skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>

            {/* Submit button skeleton */}
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Existing posts section skeleton */}
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Posts grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
              </CardHeader>
              <CardContent className="flex-1 pb-3 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </CardContent>
              <div className="p-6 pt-3 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
