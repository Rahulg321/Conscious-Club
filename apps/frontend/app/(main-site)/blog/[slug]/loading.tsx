import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const BlogPostLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <Skeleton className="w-full h-[400px]" />

      {/* Main Content Skeleton */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Category Skeleton */}
          <Skeleton className="h-6 w-24 rounded-full mb-4" />

          {/* Title Skeleton */}
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-3/4 mb-4" />

          {/* Excerpt Skeleton */}
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-6" />

          {/* Metadata Skeleton */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* Separator */}
          <div className="border-t mb-8" />

          {/* Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />

            <div className="py-4" />

            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="py-4" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />

            <div className="py-4" />

            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Footer Metadata Skeleton */}
          <div className="mt-8 pt-6 border-t">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Related Posts Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-3 pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostLoadingSkeleton;
