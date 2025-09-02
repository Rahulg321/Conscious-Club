import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Database, Megaphone } from "lucide-react";

const HeroSection = () => {
  return (
    <div>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-16 left-16 w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center rotate-12 shadow-lg">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>

        <div className="absolute top-12 right-16 w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center -rotate-12 shadow-lg">
          <Database className="w-8 h-8 text-white" />
        </div>

        <div className="absolute bottom-32 left-16 w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center rotate-12 shadow-lg">
          <span className="text-white font-bold text-lg">PO</span>
        </div>

        <div className="absolute bottom-16 right-16 w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center -rotate-12 shadow-lg">
          <Megaphone className="w-8 h-8 text-white" />
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          {/* Social proof badge */}
          <div className="mb-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-3 flex items-center gap-3 shadow-sm">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
              2000+
            </span>
            <span className="text-gray-700 font-medium">
              People have onboarded
            </span>
            <div className="flex -space-x-2">
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src="/diverse-person-portrait.png" />
                <AvatarFallback className="text-xs">U1</AvatarFallback>
              </Avatar>
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src="/diverse-group-conversation.png" />
                <AvatarFallback className="text-xs">U2</AvatarFallback>
              </Avatar>
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src="/diverse-group-meeting.png" />
                <AvatarFallback className="text-xs">U3</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 max-w-5xl leading-tight">
            All-in-One platform for Creators, <br />
            Brands &{" "}
            <span className="text-purple-600 italic font-serif">You</span>.
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Join the platform that connects curious minds, creative talent and
            brands through play and rewards.
          </p>

          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Join the Club
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
