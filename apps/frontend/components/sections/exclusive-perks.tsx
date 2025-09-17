import Image from "next/image";
export default function ExclusivePerks() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">
          <div className="relative h-60 lg:h-auto">
            <Image
              src="/exclusive-perks.png"
              alt="Two champagne glasses on a windowsill with city skyline view"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Right Content Section */}
          <div className="bg-gradient-to-br from-[#617200] to-[#8a9f00] flex flex-col justify-center px-6 sm:px-8 lg:px-16 py-12 lg:py-20">
            <div className="max-w-xl">
              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Exclusive
                <br />
                Perks
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-white/90 font-light leading-relaxed">
                Unlock deals & surprises you won't find anywhere else
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
