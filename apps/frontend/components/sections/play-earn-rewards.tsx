export default function PlayEarnRewards() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:h-[600px]">
          <div className="flex-1 flex flex-col justify-center px-16 py-20">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-bold text-white leading-tight mb-8">
                Play and Earn
                <br />
                Rewards
              </h1>

              {/* Subheading */}
              <p className="text-xl text-white/80 mb-16 font-light">
                Build your fan circle & make real connections
              </p>

              {/* Game Buttons Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Top Row */}
                <button className="bg-white text-[#6366f1] px-6 py-4 rounded-2xl text-lg font-medium hover:bg-white/90 transition-colors">
                  Selfie Style Challenge
                </button>
                <button className="bg-white text-[#6366f1] px-6 py-4 rounded-2xl text-lg font-medium hover:bg-white/90 transition-colors">
                  Lucky Spinner
                </button>

                {/* Bottom Row */}
                <button className="bg-white text-[#6366f1] px-6 py-4 rounded-2xl text-lg font-medium hover:bg-white/90 transition-colors">
                  Give away
                </button>
                <button className="border-2 border-white/30 text-white px-6 py-4 rounded-2xl text-lg font-medium hover:border-white/50 transition-colors">
                  More games are coming soon...
                </button>
              </div>
            </div>
          </div>

          {/* Right Illustration Section */}
          <div className="flex-1 relative overflow-hidden h-64 lg:h-full">
            <img
              src="/play-earn-rewards.png"
              alt="Colorful animals including a panda DJ with turntables at a vibrant party"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
