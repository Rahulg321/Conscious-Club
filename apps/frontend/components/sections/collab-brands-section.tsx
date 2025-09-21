import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CollabBrands from "@/public/collab-brands.png";

const CollabBrandsSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl h-[500px] lg:h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[300px] lg:h-full">
            <Image
              src={CollabBrands}
              alt="Stylized characters collaborating in a vibrant city setting"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content Section */}
          <div className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
            <div className="max-w-xl">
              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Collab With
                <br />
                Brands
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 lg:mb-12 font-light leading-relaxed">
                Work with the brands you love
              </p>

              {/* Brand Logos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 items-center">
                {/* Amazon */}
                <div className="text-white/90 text-xl sm:text-2xl font-bold">
                  amazon
                </div>

                {/* Dribbble */}
                <div className="text-white/90 text-xl sm:text-2xl font-bold italic">
                  dribbble
                </div>

                {/* HubSpot */}
                <div className="text-white/90 text-xl sm:text-2xl font-bold">
                  HubSpot
                </div>

                {/* Notion */}
                <div className="flex items-center text-white/90 text-xl sm:text-2xl font-bold">
                  <span className="bg-white text-orange-500 px-1.5 py-0.5 rounded mr-2 text-base sm:text-lg">
                    N
                  </span>
                  Notion
                </div>

                {/* Netflix */}
                <div className="text-white text-2xl font-bold tracking-wider col-span-2 sm:col-span-3">
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
