"use client";

import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#cf5b8d] rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-[#cf5b8d] rounded-full"></div>
              </div>
            </div>
            <span className="text-[#cf5b8d] text-xl font-semibold">
              ConsciousClub
            </span>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors"
            >
              Benefits
            </a>
            <a
              href="#"
              className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors"
            >
              Who is this for?
            </a>
            <a
              href="#"
              className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-[#e01e5a]" />
              Join as a Brand
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors"
            >
              Login
            </a>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Sign-up
            </button>
          </div>

          <button
            className="md:hidden p-2 text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-out menu */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            {/* Close button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile navigation links */}
            <nav className="flex flex-col gap-6">
              <a
                href="#"
                className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#"
                className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Who is this for?
              </a>
              <a
                href="#"
                className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Crown className="w-4 h-4 text-[#e01e5a]" />
                Join as a Brand
              </a>

              {/* Mobile auth buttons */}
              <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-gray-100">
                <a
                  href="#"
                  className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </a>
                <button
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign-up
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
