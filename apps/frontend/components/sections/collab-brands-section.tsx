import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CollabBrands from "@/public/collab-brands.png";

const CollabBrandsSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[480px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[240px] lg:h-full">
            <Image
              src={CollabBrands}
              alt="Stylized characters collaborating in a vibrant city setting"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content Section */}
          <div className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="max-w-lg">
              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2 sm:mb-3">
                Do Cool Collabs
              </h2>

              {/* Subheading */}
              <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-4 lg:mb-6 font-light leading-relaxed">
                Create mashups across disciplines. Create magic together!
              </p>

              {/* Brand Logos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
                {/* Amazon */}
                <div className="text-white/90 text-sm sm:text-base font-bold">
                  amazon
                </div>

                <div className="text-white/90 text-sm sm:text-base font-bold italic">
                  dribbble
                </div>

                <div className="text-white/90 text-sm sm:text-base font-bold">
                  HubSpot
                </div>

                <div className="flex items-center text-white/90 text-sm sm:text-base font-bold">
                  <span className="bg-white text-orange-500 px-1 py-0.5 rounded mr-1 text-[10px] sm:text-xs">
                    N
                  </span>
                  Notion
                </div>

                <div className="text-white text-base sm:text-lg font-bold tracking-wider col-span-2 sm:col-span-3">
                  NETFLIX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollabBrandsSection;
