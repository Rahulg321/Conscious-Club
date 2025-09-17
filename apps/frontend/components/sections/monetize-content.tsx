import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MonetizeContentSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[#1a1a1a] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
          {/* Text column */}
          <div className="order-2 lg:order-1 flex items-center py-12 sm:py-16 lg:py-20 px-6 sm:px-10 lg:px-16">
            <div className="w-full max-w-2xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Monetize
                <br />
                Your Content
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-[#dddfe1] mb-10 font-light">
                Turn your creativity into cool rewards
              </p>

              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl text-white font-medium">
                  Join as
                </h3>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Button className="bg-[#cdff98] text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:opacity-90">
                    Visual Arts & Design
                  </Button>
                  <Button className="bg-[#aa9bff] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:opacity-90">
                    Video & Motion Media
                  </Button>
                  <Button className="bg-[#ffc471] text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:opacity-90">
                    Writing & Storytelling
                  </Button>
                  <Button className="bg-[#ff8787] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:opacity-90">
                    Performance & Audio
                  </Button>
                  <Button className="bg-[#8bb0ff] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:opacity-90">
                    Tech & Digital Creation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 lg:order-2 relative min-h-[240px] sm:min-h-[320px] lg:min-h-[60vh]">
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#8bb0ff] to-[#aa9bff]"
              aria-hidden
            />
            <Image
              src="/young-man-character-with-phone.jpg"
              alt="3D character with colorful hair holding a phone"
              fill
              priority
              className="object-cover object-center mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
