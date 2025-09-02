export default function ExclusivePerks() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row lg:h-[700px]">
          <div className="flex-1 relative h-64 lg:h-full">
            <img
              src="/exclusive-perks.png"
              alt="Two champagne glasses on a windowsill with city skyline view"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Content Section */}
          <div className="flex-1 bg-gradient-to-br from-[#617200] to-[#8a9f00] flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-20">
            <div className="max-w-xl">
              {/* Main Heading */}
              <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Exclusive
                <br />
                Perks
              </h2>

              {/* Subheading */}
              <p className="text-lg lg:text-xl text-white/90 font-light leading-relaxed">
                Unlock deals & surprises you won't find anywhere else
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
