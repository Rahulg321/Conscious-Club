import Image from "next/image";
import WorldMap from "@/public/world-map.png";

export default function CommunityBanner() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="relative overflow-hidden rounded-4xl bg-[#158f7b]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
          <div className="px-8 py-12 lg:px-16">
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Grow Your
              <br />
              Community
            </h2>
            <p className="text-base lg:text-xl text-white/90 font-medium max-w-md">
              Build your fan circle & make real connections
            </p>
            <div>
              <Image
                src={WorldMap}
                alt="Community Banner"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative h-60 lg:h-full">
            <Image
              src="/community.png"
              alt="Diverse group of young people representing community members"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
