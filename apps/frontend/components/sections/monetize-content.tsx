export default function MonetizeContentSection() {
  return (
    <div className="px-6">
      <div className="min-h-screen rounded-2xl bg-[#1a1a1a] flex">
        <div className="flex-1 flex flex-col justify-center px-16 py-20">
          <div className="max-w-2xl">
            <h1 className="text-7xl font-bold text-white leading-tight mb-8">
              Monetize
              <br />
              Your Content
            </h1>

            <p className="text-xl text-[#dddfe1] mb-16 font-light">
              Turn your creativity into cool rewards
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl text-white font-medium">Join as</h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <button className="bg-[#cdff98] text-black px-6 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
                    Visual Arts & Design
                  </button>
                  <button className="bg-[#aa9bff] text-white px-6 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
                    Video & Motion Media
                  </button>
                  <button className="bg-[#ffc471] text-black px-6 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
                    Writing & Storytelling
                  </button>
                </div>

                <div className="flex gap-4">
                  <button className="bg-[#ff8787] text-white px-6 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
                    Performance & Audio
                  </button>
                  <button className="bg-[#8bb0ff] text-white px-6 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
                    Tech & Digital Creation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8bb0ff] to-[#aa9bff]">
            <img
              src="/young-man-character-with-phone.jpg"
              alt="3D character with colorful hair holding a phone"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
