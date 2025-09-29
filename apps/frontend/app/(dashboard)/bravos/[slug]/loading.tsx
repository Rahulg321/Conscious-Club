import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="block-space-mini big-container">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="pt-2">
          <div className="w-[300px] h-[128px] rounded-md overflow-hidden bg-gray-100">
            <Skeleton className="w-full h-full" />
          </div>
        </div>

        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
};

export default loading;
