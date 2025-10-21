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
import { Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Session } from "next-auth";
import HoverBorder from "./ui/hover-btn";

export default function Header({ userSession }: { userSession: Session | null }) {
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
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
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
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* <DummyContent /> */}

      {/* Navbar */}
    </div>
  );
}
