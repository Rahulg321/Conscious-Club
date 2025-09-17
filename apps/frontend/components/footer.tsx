import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

import CClogo from "@/public/cc-home-logo.png";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="px-4 py-6 max-w-7xl mx-auto">
      <div className="w-full mb-16">
        <h1
          className="
            text-[48px]
            sm:text-[80px]
            md:text-[120px]
            lg:text-[160px]
            xl:text-[170px]
            text-[rgba(212,110,154,1)]
            leading-none
            font-semibold
          "
        >
          Conscious Club
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
              Subscribe to our newsletter for
            </h2>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
              weekly updates on our Creativity
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <Input
              type="email"
              placeholder="Enter your email to get the latest news..."
              className="flex-1 bg-white border-gray-200 text-gray-600 placeholder:text-gray-400"
            />
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-2 whitespace-nowrap">
              Submit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Join as Brand
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Persona
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Roadmap
              </a>
            </nav>
          </div>
          <div className="space-y-4">
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Help
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200">
        <Image src={CClogo} alt="ConsciousClub Logo" />

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span className="sr-only">Facebook</span>
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="sr-only">Instagram</span>
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Youtube className="w-5 h-5" />
            <span className="sr-only">YouTube</span>
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span className="sr-only">Twitter</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
