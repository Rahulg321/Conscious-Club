import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="block-space narrow-container space-y-8 md:space-y-10">
      {/* Page title */}
      <Skeleton className="h-10 w-3/4" />
      {/* Last updated */}
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-px w-full" />

      {/* Intro paragraphs */}
      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full" />

      {/* Section: 1. THE APPLICATION */}
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-9/12" />
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Section: 2. SCOPE OF LICENSE */}
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full" />

      {/* Section: 3. TECHNICAL REQUIREMENTS */}
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full" />

      {/* Sections: 4, 5, 6 (Maintenance, Data, UGC) */}
      {[...Array(3)].map((_, sectionIdx) => (
        <div key={sectionIdx} className="space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full" />
        </div>
      ))}

      {/* Section: 7. LIABILITY */}
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-8/12" />
      </div>

      <Skeleton className="h-px w-full" />

      {/* Section: 8. WARRANTY */}
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full" />

      {/* Section: 9. PRODUCT CLAIMS + list */}
      <Skeleton className="h-8 w-2/3" />
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-2 pl-6">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <Skeleton className="h-px w-full" />

      {/* Sections: 10, 11, 12, 13, 14, 15, 16 */}
      {[...Array(7)].map((_, sectionIdx) => (
        <div key={sectionIdx} className="space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
          {/* Email line (for Contact section) */}
          {sectionIdx === 1 && <Skeleton className="h-4 w-48" />}
          <Skeleton className="h-px w-full" />
        </div>
      ))}
    </div>
  );
};

export default Loading;
