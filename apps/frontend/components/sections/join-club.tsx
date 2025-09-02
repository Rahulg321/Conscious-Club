import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const JoinClubSection = () => {
  return (
    <div className="py-12 px-6">
      <div className="relative bg-gradient-to-r cta min-h-[70vh] rounded-2xl from-[#8f00ff] via-[#a401dd] to-[#171717] flex items-center justify-center p-8 sm:p-10 lg:p-12">
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Brands, join the Club
          </h1>

          <p className="text-white/90 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed">
            Run creative, gamified campaigns,
            <br />
            connect with diverse UGC and grow community
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center max-w-3xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your company email"
              className="flex-1 h-14 sm:h-16 text-base sm:text-lg px-5 sm:px-6 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/40 backdrop-blur-sm min-w-0 w-full sm:w-auto"
            />
            <Button className="h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-xl shadow-sm">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClubSection;
