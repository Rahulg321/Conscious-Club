import type { Metadata } from "next";
import { prata, poppins } from "@/app/fonts";
import "../globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

import DashboardHeader from "@/components/dashboard-header";
import { baseUrl } from "../sitemap";
import { GoogleAnalytics } from "@next/third-parties/google";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ConsciousClubb",
    template: "%s | ConsciousClubb",
  },
  description:
    "Building the Creator economy of tomorrow. Join the gamified platform where explorers, creators, organizers, and brands connect through self-expression, play, and rewards.",
  openGraph: {
    title: "ConsciousClubb",
    description:
      "Building the Creator economy of tomorrow. Join the gamified platform where explorers, creators, organizers, and brands connect through self-expression, play, and rewards.",
    url: baseUrl,
    siteName: "ConsciousClubb",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "ConsciousClubb",
    card: "summary_large_image",
    description:
      "Building the Creator economy of tomorrow. Join the gamified platform where explorers, creators, organizers, and brands connect through self-expression, play, and rewards.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prata.variable} ${poppins.variable} antialiased`}>
        <SessionProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full ">
              <AppSidebar />

              <main className="flex-1 min-w-0">
                <SidebarInset className="">
                  <Suspense>
                    <DashboardHeader />
                  </Suspense>
                  {children}
                </SidebarInset>
              </main>
            </div>
          </SidebarProvider>
        </SessionProvider>
        <Toaster />
      </body>

      <GoogleAnalytics gaId="G-C906QR0P8S" />
    </html>
  );
}
