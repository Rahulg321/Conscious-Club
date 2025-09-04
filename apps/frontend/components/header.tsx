"use client";

import { ChevronDown, Crown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  FiPlus,
  FiList,
  FiCheckSquare,
  FiEdit,
  FiTrendingUp,
  FiSearch,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function Header({
  userSession,
}: {
  userSession: Session | null;
}) {
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Benefits", href: "#" },
    { label: "Who is this for?", href: "#" },
    { label: "Join as a Brand", href: "#", icon: Crown },
  ] satisfies ReadonlyArray<{
    label: string;
    href: string;
    icon?: typeof Crown;
  }>;

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
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={`text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors${Icon ? " flex items-center gap-2" : ""}`}
              >
                {Icon ? <Icon className="w-4 h-4 text-[#e01e5a]" /> : null}
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {userSession ? (
              <ProfileMenu session={userSession} />
            ) : (
              <>
                <a
                  href="/login"
                  className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors"
                >
                  Login
                </a>
                <Button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className=""
                >
                  Sign-up
                </Button>
              </>
            )}
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

            <nav className="flex flex-col gap-6">
              {navLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={`mobile-${label}`}
                  href={href}
                  className={`text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2${Icon ? " flex items-center gap-2" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {Icon ? <Icon className="w-4 h-4 text-[#e01e5a]" /> : null}
                  {label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-gray-100">
                {userSession ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            userSession.user?.image ||
                            "https://github.com/shadcn.png"
                          }
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#3e4a5b]">
                          {userSession.user?.name || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {userSession.user?.email}
                        </span>
                      </div>
                    </div>
                    <button
                      className="text-left text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2"
                      onClick={() => {
                        router.push(`/profile/${userSession.user?.id}`);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="text-left text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2"
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="text-[#3e4a5b] hover:text-[#cf5b8d] transition-colors text-lg py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </a>
                    <button
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
                      onClick={() => {
                        router.push("/login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign-up
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({ session }: { session: Session }) {
  const router = useRouter();
  console.log("session", session);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={session.user?.image || "https://github.com/shadcn.png"}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-base flex items-center font-medium">
          Account <ChevronDown />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/profile/${session.user?.id}`);
          }}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
