import React from "react";

const CollabBrandsSection = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:h-[600px]">
          <div className="flex-1 relative h-64 lg:h-full">
            <img
              src="/collab-brands.png"
              alt="Stylized characters collaborating in a vibrant city setting"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right Content Section */}
          <div className="flex-1 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex flex-col justify-center px-12 py-12 lg:py-16 lg:h-full">
            <div className="max-w-lg">
              {/* Main Heading */}
              <h2 className="text-6xl font-bold text-white leading-tight mb-6">
                Collab With
                <br />
                Brands
              </h2>

              {/* Subheading */}
              <p className="text-xl text-white/90 mb-12 font-light">
                Work with the brands you love
              </p>

              {/* Brand Logos Grid */}
              <div className="grid grid-cols-2 gap-8 items-center">
                {/* Amazon */}
                <div className="text-white text-2xl font-bold">amazon</div>

                {/* Dribbble */}
                <div className="text-white text-2xl font-bold italic">
                  dribbble
                </div>

                {/* HubSpot */}
                <div className="text-white text-2xl font-bold">HubSpot</div>

                {/* Notion */}
                <div className="flex items-center text-white text-2xl font-bold">
                  <span className="bg-white text-orange-500 px-2 py-1 rounded mr-2 text-lg">
                    N
                  </span>
                  Notion
                </div>

                {/* Netflix */}
                <div className="text-white text-2xl font-bold tracking-wider col-span-2">
                  NETFLIX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabBrandsSection;
