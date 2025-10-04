import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PlayEarnRewardsImage from "@/public/play-earn-rewards.png";

export default function PlayEarnRewards({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl overflow-hidden h-[500px] lg:h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="order-2 lg:order-1 flex items-center px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
            <div className="w-full max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Play and Earn
                <br />
                Rewards
              </h2>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 font-light leading-relaxed">
                Build your fan circle & make real connections
              </p>

              {/* Game Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {/* Top Row */}
                <Button className="bg-white text-[#6366f1] px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  Selfie Style Challenge
                </Button>
                <Button className="bg-white text-[#6366f1] px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  Lucky Spinner
                </Button>

                {/* Bottom Row */}
                <Button className="bg-white text-[#6366f1] px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium hover:bg-white/90 whitespace-nowrap">
                  Give away
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  More games are coming soon...
                </Button>
              </div>
            </div>
          </div>

          {/* Right Illustration Section */}
          <div className="relative h-[300px] lg:h-full">
            <Image
              src={PlayEarnRewardsImage}
              alt="Colorful animals including a panda DJ with turntables at a vibrant party"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
