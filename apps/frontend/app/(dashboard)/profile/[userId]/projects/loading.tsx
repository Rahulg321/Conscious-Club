import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-[#171c21]">
        <Loader2 className="size-6 animate-spin" />
        <span>Loading projects…</span>
      </div>
    </div>
  );
};

export default Loading;
