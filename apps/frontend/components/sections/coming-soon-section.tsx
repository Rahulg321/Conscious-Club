import React from "react";
import Image from "next/image";
import ComingSoonGif from "@/public/coming-soon.gif";

const ComingSoonSection = () => {
  return (
    <div className="bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Image
          src={ComingSoonGif}
          alt="Stay Tuned"
          className="mb-6 rounded-xl shadow-lg"
        />
        <h2 className="text-xl font-bold mb-2 text-white">December 2025</h2>
      </div>
    </div>
  );
};

export default ComingSoonSection;
