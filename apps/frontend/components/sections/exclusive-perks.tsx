import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ExclusivePerks({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg lg:h-[550px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[320px] sm:h-[400px] md:h-[450px] lg:h-full w-full">
            <Image
              src="/exclusive-perks.png"
              alt="Two champagne glasses on a windowsill with city skyline view"
              fill
              priority
              className="object-cover object-center lg:rounded-l-3xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="bg-gradient-to-br from-[#617200] to-[#8a9f00] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            <div className="max-w-lg mx-auto lg:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 lg:mb-6">
                Unlock Perks
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-lg text-white/90 font-light leading-relaxed">
                Get exclusive rewards you won't find anywhere else
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
