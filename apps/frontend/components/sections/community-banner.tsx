import Image from "next/image";
import WorldMap from "@/public/world-map.png";
import { cn } from "@/lib/utils";

export default function CommunityBanner({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="relative overflow-visible rounded-3xl bg-[#158f7b] h-[500px] lg:h-[600px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="overflow-hidden">
            <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Grow Your
                <br />
                Community
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium max-w-md leading-relaxed">
                Build your fan circle & make real connections
              </p>
            </div>
            <div className="relative h-[180px] sm:h-[200px] lg:h-[300px]">
              <Image
                src={WorldMap}
                alt="Community Banner"
                fill
                className="object-cover object-bottom"
              />
            </div>
          </div>

          <div className="relative h-[300px] overflow-hidden lg:h-full rounded-r-4xl">
            <Image
              src="/community.png"
              alt="Diverse group of young people representing community members"
              className="rounded-r-4xl object-cover"
              fill
            />
          </div>
        </div>
      </div>
    </section>
  );
}
