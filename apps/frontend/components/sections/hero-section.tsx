import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Database,
  Megaphone,
  PenTool,
  Camera,
  MicVocal,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-4 left-4 sm:top-16 sm:left-16 w-10 h-10 sm:w-16 sm:h-16 bg-[#EA591F] rounded-xl flex items-center justify-center rotate-12 shadow-lg">
          <PenTool className="w-5 h-5 sm:w-8 sm:h-8 text-white rotate-260" />
        </div>

        <div className="absolute top-2 right-4 sm:top-12 sm:right-16 w-10 h-10 sm:w-16 sm:h-16 bg-teal-600 rounded-xl flex items-center justify-center -rotate-12 shadow-lg">
          <Database className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
        </div>

        <div className="absolute bottom-24 left-8 sm:bottom-40 sm:left-32 w-10 h-10 sm:w-16 sm:h-16 bg-yellow-400 rounded-xl flex items-center justify-center rotate-12 shadow-lg">
          <Camera className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
        </div>

        <div className="absolute bottom-28 right-12 sm:bottom-44 sm:right-40 w-10 h-10 sm:w-16 sm:h-16 bg-[#514ADB] rounded-2xl flex items-center justify-center -rotate-12 shadow-2xl">
          <MicVocal className="w-6 h-6 sm:size-12 text-white" />
        </div>

        <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[80dvh] text-center">
          <div className="mb-12 border-2 border-gray-200 rounded-full px-6 py-3 flex items-center gap-3 shadow-sm">
            <span
              className="text-white px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(90deg, #FCB35C -0.08%, #DF60C3 51.36%, #825BF3 99.92%)",
                boxShadow:
                  "inset 0px 4px 6px 2px #FFFFFF9E, inset 0px -2px 6px 2px #00000026, 0px 2px 4.7px 0px #00000047",
              }}
            >
              2000+
            </span>
            <span className="text-gray-700 font-medium">
              People have onboarded
            </span>
            <div className="flex -space-x-2">
              <Avatar className="size-8 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback className="text-xs">U1</AvatarFallback>
              </Avatar>
              <Avatar className="size-8 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback className="text-xs">U2</AvatarFallback>
              </Avatar>
              <Avatar className="size-8 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <AvatarFallback className="text-xs">U3</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl font-medium mb-8 max-w-5xl leading-tight">
            All-in-One platform for Creators, <br />
            Brands & <span className="italic itc-font gradient-text">You.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground font-semibold mb-12 max-w-2xl leading-relaxed">
            Join the platform that connects curious minds, creative talent and
            brands through play and rewards.
          </p>

          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            asChild
          >
            <Link href="/login">Join the Club</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
