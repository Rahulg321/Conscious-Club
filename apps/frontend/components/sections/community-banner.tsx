export default function CommunityBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#158f7b] mx-4 my-8 lg:mx-8">
      <div className="relative z-10 grid lg:grid-cols-2 items-center min-h-[500px] lg:h-[600px]">
        {/* Left Content Section */}
        <div className="px-8 py-12 lg:px-16 lg:py-20">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
            Grow Your
            <br />
            Community
          </h1>
          <p className="text-lg lg:text-xl text-white/90 font-medium max-w-md">
            Build your fan circle & make real connections
          </p>
        </div>

        {/* Right Image Section */}
        <div className="relative h-64 lg:h-full">
          <img
            src="/community.png"
            alt="Diverse group of young people representing community members"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Decorative Dotted Pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 left-0 w-full h-full opacity-30"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* World map-like dotted pattern */}
          <g fill="rgba(255,255,255,0.4)">
            {/* North America region */}
            <circle cx="150" cy="120" r="2" />
            <circle cx="160" cy="125" r="2" />
            <circle cx="170" cy="130" r="2" />
            <circle cx="180" cy="135" r="2" />
            <circle cx="140" cy="140" r="2" />
            <circle cx="150" cy="145" r="2" />
            <circle cx="160" cy="150" r="2" />
            <circle cx="170" cy="155" r="2" />
            <circle cx="130" cy="160" r="2" />
            <circle cx="140" cy="165" r="2" />
            <circle cx="150" cy="170" r="2" />
            <circle cx="160" cy="175" r="2" />
            <circle cx="170" cy="180" r="2" />
            <circle cx="180" cy="185" r="2" />

            {/* Europe region */}
            <circle cx="320" cy="100" r="2" />
            <circle cx="330" cy="105" r="2" />
            <circle cx="340" cy="110" r="2" />
            <circle cx="350" cy="115" r="2" />
            <circle cx="310" cy="120" r="2" />
            <circle cx="320" cy="125" r="2" />
            <circle cx="330" cy="130" r="2" />
            <circle cx="340" cy="135" r="2" />
            <circle cx="350" cy="140" r="2" />
            <circle cx="360" cy="145" r="2" />

            {/* Asia region */}
            <circle cx="450" cy="90" r="2" />
            <circle cx="460" cy="95" r="2" />
            <circle cx="470" cy="100" r="2" />
            <circle cx="480" cy="105" r="2" />
            <circle cx="490" cy="110" r="2" />
            <circle cx="440" cy="115" r="2" />
            <circle cx="450" cy="120" r="2" />
            <circle cx="460" cy="125" r="2" />
            <circle cx="470" cy="130" r="2" />
            <circle cx="480" cy="135" r="2" />
            <circle cx="490" cy="140" r="2" />
            <circle cx="500" cy="145" r="2" />
            <circle cx="510" cy="150" r="2" />

            {/* Africa region */}
            <circle cx="320" cy="180" r="2" />
            <circle cx="330" cy="185" r="2" />
            <circle cx="340" cy="190" r="2" />
            <circle cx="350" cy="195" r="2" />
            <circle cx="310" cy="200" r="2" />
            <circle cx="320" cy="205" r="2" />
            <circle cx="330" cy="210" r="2" />
            <circle cx="340" cy="215" r="2" />
            <circle cx="350" cy="220" r="2" />
            <circle cx="360" cy="225" r="2" />

            {/* South America region */}
            <circle cx="200" cy="200" r="2" />
            <circle cx="210" cy="205" r="2" />
            <circle cx="220" cy="210" r="2" />
            <circle cx="190" cy="215" r="2" />
            <circle cx="200" cy="220" r="2" />
            <circle cx="210" cy="225" r="2" />
            <circle cx="220" cy="230" r="2" />
            <circle cx="200" cy="235" r="2" />
            <circle cx="210" cy="240" r="2" />

            {/* Australia region */}
            <circle cx="520" cy="220" r="2" />
            <circle cx="530" cy="225" r="2" />
            <circle cx="540" cy="230" r="2" />
            <circle cx="550" cy="235" r="2" />
            <circle cx="510" cy="240" r="2" />
            <circle cx="520" cy="245" r="2" />

            {/* Additional scattered dots for network effect */}
            <circle cx="100" cy="80" r="1.5" />
            <circle cx="250" cy="70" r="1.5" />
            <circle cx="400" cy="60" r="1.5" />
            <circle cx="550" cy="80" r="1.5" />
            <circle cx="600" cy="120" r="1.5" />
            <circle cx="650" cy="160" r="1.5" />
            <circle cx="80" cy="200" r="1.5" />
            <circle cx="120" cy="240" r="1.5" />
            <circle cx="280" cy="260" r="1.5" />
            <circle cx="420" cy="280" r="1.5" />
            <circle cx="580" cy="300" r="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
