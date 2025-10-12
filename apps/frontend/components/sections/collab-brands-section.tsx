import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CollabBrands from "@/public/collab-brands.png";

const CollabBrandsSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[320px] sm:h-[400px] md:h-[450px] lg:h-full w-full">
            <Image
              src={CollabBrands}
              alt="Stylized characters collaborating in a vibrant city setting"
              fill
              className="object-cover lg:rounded-l-3xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right Content Section */}
          <div className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            <div className="max-w-lg mx-auto lg:mx-0">
              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 lg:mb-5">
                Do Cool Collabs
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-lg text-white/90 mb-6 lg:mb-8 font-light leading-relaxed">
                Create mashups across disciplines. Create magic together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollabBrandsSection;
