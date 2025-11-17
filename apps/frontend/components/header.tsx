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
import { User, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import HoverBorder from "./ui/hover-btn";
import Image from "next/image";
import { toast } from "sonner";

export default function Header({}: {}) {
  const { data: session, status } = useSession();

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

  const trimTextLength = (
    text: string | null | undefined,
    length: number = 10
  ) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="w-full sticky top-0 z-50">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-50">
            {status === "loading" ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    <Image
                      src={
                        session.user?.image ??
                        `https://avatar.vercel.sh/${session.user?.email}`
                      }
                      alt={session.user?.email ?? "User Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {trimTextLength(
                        session.user?.name || session.user?.email,
                        20
                      )}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/profile/${session.user?.id}`);
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
                    router.push("/register");
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
            <div className="flex w-full flex-col gap-2">
              {status === "loading" ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : session ? (
                <>
                  {/* <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Image
                      src={
                        session.user?.image ??
                        `https://avatar.vercel.sh/${session.user?.email}`
                      }
                      alt={session.user?.email ?? "User Avatar"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {session.user?.name || session.user?.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.user?.email}
                      </div>
                    </div>
                  </div> */}
                  <NavbarButton
                    onClick={() => {
                      router.push(`/profile/${session.user?.id}`);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full flex items-center justify-center"
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
                    variant="primary"
                    className="w-full text-red-600 hover:text-red-700 flex items-center justify-center"
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
