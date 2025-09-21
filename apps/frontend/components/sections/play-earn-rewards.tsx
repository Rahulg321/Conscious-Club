import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PlayEarnRewardsImage from "@/public/play-earn-rewards.png";

export default function PlayEarnRewards({ className }: { className?: string }) {
  return (
    <section className={cn("", className)}>
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl overflow-hidden h-[500px] lg:h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="order-2 lg:order-1 flex items-center px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
            <div className="w-full max-w-2xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Play and Earn
                <br />
                Rewards
              </h2>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-10 font-light">
                Build your fan circle & make real connections
              </p>

              {/* Game Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Top Row */}
                <Button className="bg-white text-[#6366f1] px-6 py-4 rounded-2xl text-base sm:text-lg font-medium hover:bg-white/90">
                  Selfie Style Challenge
                </Button>
                <Button className="bg-white text-[#6366f1] px-6 py-4 rounded-2xl text-base sm:text-lg font-medium hover:bg-white/90">
                  Lucky Spinner
                </Button>

                {/* Bottom Row */}
                <Button className="bg-white text-[#6366f1] px-6 py-4 rounded-2xl text-base sm:text-lg font-medium hover:bg-white/90">
                  Give away
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-6 py-4 rounded-2xl text-base sm:text-lg font-medium"
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
