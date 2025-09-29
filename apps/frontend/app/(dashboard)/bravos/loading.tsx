import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingCard = () => {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="w-full h-32 bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-2">
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

const loading = () => {
  const types = ["All", "Boss", "Bestie", "Buzz", "Bold", "Brag"] as const;
  return (
    <div className="block-space-mini big-container">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-4">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
        {types.map((t) => (
          <Skeleton key={t} className="h-8 w-20 rounded-md" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default loading;
