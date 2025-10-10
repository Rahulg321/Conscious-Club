import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CollabBrands from "@/public/collab-brands.png";

const CollabBrandsSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl h-[450px] sm:h-[500px] lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[260px] sm:h-[300px] lg:h-full aspect-[4/3] lg:aspect-auto">
            <Image
              src={CollabBrands}
              alt="Stylized characters collaborating in a vibrant city setting"
              fill
              className="object-cover lg:rounded-l-3xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Content Section */}
          <div className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex flex-col justify-center px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
            <div className="max-w-lg">
              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 lg:mb-5">
                Do Cool Collabs
              </h2>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-5 sm:mb-7 lg:mb-8 font-light leading-relaxed">
                Create mashups across disciplines. Create magic together!
              </p>

              {/* Brand Logos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 items-center">
                {/* Amazon */}
                <div className="text-white/90 text-base sm:text-lg lg:text-xl font-bold">
                  amazon
                </div>

                <div className="text-white/90 text-base sm:text-lg lg:text-xl font-bold italic">
                  dribbble
                </div>

                <div className="text-white/90 text-base sm:text-lg lg:text-xl font-bold">
                  HubSpot
                </div>

                <div className="flex items-center text-white/90 text-base sm:text-lg lg:text-xl font-bold">
                  <span className="bg-white text-orange-500 px-1.5 py-1 rounded mr-1.5 text-xs sm:text-sm">
                    N
                  </span>
                  Notion
                </div>

                <div className="text-white text-lg sm:text-xl lg:text-2xl font-bold tracking-wider col-span-2 sm:col-span-3">
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
