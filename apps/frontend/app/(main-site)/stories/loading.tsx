import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const BlogLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Skeleton */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-12 w-full max-w-2xl rounded-lg" />
        </div>
      </header>

      {/* Category Filter Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      {/* Tag Filter Skeleton */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-5 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogLoadingSkeleton;
