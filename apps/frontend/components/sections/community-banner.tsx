import Image from "next/image";
import WorldMap from "@/public/world-map.png";
import { cn } from "@/lib/utils";

export default function CommunityBanner({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="relative overflow-visible rounded-3xl bg-[#158f7b] h-[400px] lg:h-[480px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Grow Your
                <br />
                Community
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/90 font-medium max-w-md leading-relaxed">
                Build your fan circle & make real connections
              </p>
            </div>
            <div className="relative h-[140px] sm:h-[160px] lg:h-[220px]">
              <Image
                src={WorldMap}
                alt="Community Banner"
                fill
                className="object-cover object-bottom"
              />
            </div>
          </div>

          <div className="relative h-[240px] overflow-hidden lg:h-full rounded-r-4xl">
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
