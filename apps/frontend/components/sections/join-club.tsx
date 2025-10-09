import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

import AstroGradient from "@/public/backgrounds/astro-gradient.png";

const JoinClubSection = () => {
  return (
    <div className="py-8 px-6">
      <div className="relative overflow-hidden cta min-h-[50vh] sm:min-h-[55vh] rounded-2xl flex items-center justify-center p-6 sm:p-8 lg:p-10">
        <Image
          src={AstroGradient}
          alt=""
          fill
          className="absolute inset-0 object-cover"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl lg:max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
            Brands, join the Club
          </h1>

          <p className="text-white/90 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Run creative, gamified campaigns,
            <br />
            connect with diverse creators and grow community
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center max-w-lg mx-auto w-full">
            <Input
              type="email"
              placeholder="Enter your company email"
              className="flex-1 h-11 sm:h-13 text-xs sm:text-sm px-3 sm:px-4 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/40 backdrop-blur-sm min-w-0 w-full"
            />
            <Button className="w-full sm:w-auto h-11 sm:h-13 px-5 sm:px-7 text-xs sm:text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-xl shadow-sm">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClubSection;
