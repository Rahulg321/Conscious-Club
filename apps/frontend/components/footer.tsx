import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

import CClogo from "@/public/cc-home-logo.png";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-4 py-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        {/* <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">Get your weekly dose of creativity.</h2>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">inspo straight to your inbox.</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <Input
              type="email"
              placeholder="Enter your email to get the latest news..."
              className="flex-1 bg-white border-gray-200 text-gray-600 placeholder:text-gray-400"
            />
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-2 whitespace-nowrap">Submit</Button>
          </div>
        </div> */}
        {/* 
        <div className="grid grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Join as Brand
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Persona
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Roadmap
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Use
              </Link>
              <Link href="/creator-terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Creator Terms
              </Link>
              <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/license" className="text-gray-600 hover:text-gray-900 transition-colors">
                License
              </Link>
            </nav>
          </div>
        </div> */}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col justify-between items-center  pt-8 border-t border-gray-200">
        <a href="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
          <img src="/CC_Logo_Favicon.png" alt="logo" width={80} height={50} />
          <span className="font-medium text-red-500 text-lg">ConsiousClub</span>
        </a>
        <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
          Privacy Policy
        </Link>
        <Link href="/terms-of-use" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
          Terms of Use
        </Link>
      </div>

      {/* Social Icons */}
      {/* <div className="flex items-center gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Facebook className="w-5 h-5" />
            <span className="sr-only">Facebook</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Instagram className="w-5 h-5" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Youtube className="w-5 h-5" />
            <span className="sr-only">YouTube</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Twitter className="w-5 h-5" />
            <span className="sr-only">Twitter</span>
          </a>
        </div> */}
    </footer>
  );
}
