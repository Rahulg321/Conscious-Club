import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ExclusivePerks({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-[500px] lg:h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="relative h-[300px] lg:h-full rounded-l-4xl">
            <Image
              src="/exclusive-perks.png"
              alt="Two champagne glasses on a windowsill with city skyline view"
              fill
              priority
              className="object-cover object-center rounded-l-4xl"
            />
          </div>

          <div className="bg-gradient-to-br from-[#617200] to-[#8a9f00] flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-10 lg:py-16">
            <div className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Exclusive
                <br />
                Perks
              </h2>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-white/90 font-light leading-relaxed">
                Unlock deals & surprises you won't find anywhere else
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
