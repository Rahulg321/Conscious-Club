import Image from "next/image";
import WorldMap from "@/public/world-map.png";
import { cn } from "@/lib/utils";

export default function CommunityBanner({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="relative overflow-visible rounded-3xl bg-[#158f7b] lg:h-[550px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="overflow-hidden flex flex-col">
            <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 lg:mb-6">
                Grow Your Community
              </h2>
              <p className="text-base sm:text-lg lg:text-lg text-white/90 font-medium max-w-md leading-relaxed">
                Build your global fanbase, let your tribe find you :)
              </p>
            </div>
            <div className="relative flex-1 min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
              <Image
                src={WorldMap}
                alt="Community Banner"
                fill
                className="object-cover object-bottom"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[400px] md:h-[450px] lg:h-full w-full overflow-hidden">
            <Image
              src="/community.png"
              alt="Diverse group of young people representing community members"
              className="object-cover lg:rounded-r-3xl"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
