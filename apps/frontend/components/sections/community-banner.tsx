import Image from "next/image";
import WorldMap from "@/public/world-map.png";
import { cn } from "@/lib/utils";

export default function CommunityBanner({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="relative overflow-visible rounded-3xl bg-[#158f7b] h-[500px] lg:h-[600px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="overflow-hidden">
            <div className="px-8 py-12 lg:px-16">
              <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Grow Your
                <br />
                Community
              </h2>
              <p className="text-base lg:text-xl text-white/90 font-medium max-w-md">
                Build your fan circle & make real connections
              </p>
            </div>
            <div className="relative h-[200px] lg:h-[300px]">
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
