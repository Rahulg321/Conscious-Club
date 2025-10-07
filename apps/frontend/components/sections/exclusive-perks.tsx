import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ExclusivePerks({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-[400px] lg:h-[480px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[240px] lg:h-full rounded-l-4xl">
            <Image
              src="/exclusive-perks.png"
              alt="Two champagne glasses on a windowsill with city skyline view"
              fill
              priority
              className="object-cover object-center rounded-l-4xl"
            />
          </div>

          <div className="bg-gradient-to-br from-[#617200] to-[#8a9f00] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <div className="max-w-lg">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Exclusive
                <br />
                Perks
              </h2>

              {/* Subheading */}
              <p className="text-xs sm:text-sm lg:text-base text-white/90 font-light leading-relaxed">
                Unlock deals & surprises you won't find anywhere else
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
