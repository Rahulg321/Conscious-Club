"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import HoverBorder from "./ui/hover-btn";
import Image from "next/image";
import { toast } from "sonner";

export default function Header({
  userSession,
}: {
  userSession: Session | null;
}) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Stories",
      link: "/stories",
    },
    {
      name: "Community",
      link: "/community",
    },
    {
      name: "Contact Us",
      link: "/contact-us",
    },
  ];

  return (
    <div className="w-full sticky top-0 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-50">
            {userSession ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    <Image
                      src={
                        userSession.user?.image ??
                        `https://avatar.vercel.sh/${userSession.user?.email}`
                      }
                      alt={userSession.user?.email ?? "User Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {userSession.user?.name || userSession.user?.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/profile/${userSession.user?.id}`);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => {
                      signOut({
                        redirectTo: "/",
                      });
                      toast.success("Logged out successfully");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <NavbarButton
                  className="text-purple-900 underline underline-offset-2"
                  variant="secondary"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Login
                </NavbarButton>
                <HoverBorder
                  containerClassName="rounded-full h-12 w-24 cursor-pointer font-bold text-purple-900"
                  highlightColor="#D0FFF9"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Sign Up
                </HoverBorder>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {userSession ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Image
                      src={
                        userSession.user?.image ??
                        `https://avatar.vercel.sh/${userSession.user?.email}`
                      }
                      alt={userSession.user?.email ?? "User Avatar"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {userSession.user?.name || userSession.user?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userSession.user?.email}
                      </p>
                    </div>
                  </div>
                  <NavbarButton
                    onClick={() => {
                      router.push(`/profile/${userSession.user?.id}`);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      signOut({
                        redirectTo: "/",
                      });
                      toast.success("Logged out successfully");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="secondary"
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => {
                      router.push("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      router.push("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Sign Up
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* <DummyContent /> */}

      {/* Navbar */}
    </div>
  );
}
