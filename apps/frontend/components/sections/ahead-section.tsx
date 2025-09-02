import React from "react";

const AheadSection = () => {
  return (
    <div>
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center space-y-16">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-normal text-[#131316] leading-tight">
              We're just getting started.
            </h1>
            <p className="text-4xl md:text-5xl italic text-purple-600 leading-tight">
              Here's what's ahead.
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-12 pt-8">
            <div className="text-3xl md:text-4xl text-[#131316]">
              <span className="font-normal">Onboarding </span>
              <span className="italic">Explorers, Creators, Organisers</span>
            </div>

            <div className="text-3xl md:text-4xl text-[#131316]">
              <span className="font-normal">Building a </span>
              <span className="italic">Community & Gamification</span>
            </div>

            <div className="text-3xl md:text-4xl text-[#131316]">
              <span className="italic">Brand Campaigns </span>
              <span className="font-normal italic">roll-out</span>
            </div>

            <div className="text-3xl md:text-4xl text-[#131316] italic">
              Platform based Challenges
            </div>

            <div className="text-3xl md:text-4xl text-[#131316] italic">
              And more...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AheadSection;
