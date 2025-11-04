import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Conscious Club",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: "noindex, nofollow",
};

const NotFoundPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <Image
              src={CClogo}
              alt="ConsciousClub Logo"
              width={50}
              height={50}
            />
          </Link>
        </div>

        {/* 404 */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-muted select-none">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/discover" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Discover
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
