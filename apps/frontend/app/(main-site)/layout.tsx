import type { Metadata } from "next";
import { prata, poppins } from "@/app/fonts";
import "../globals.css";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { itcFont, inter } from "@/app/fonts";
import { baseUrl } from "../sitemap";
import { GoogleAnalytics } from "@next/third-parties/google";

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
    <html lang="en">
      <body
        className={`${prata.variable} ${poppins.variable} ${itcFont.variable} ${inter.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
        <Toaster />
      </body>

      <GoogleAnalytics gaId="G-C906QR0P8S" />
    </html>
  );
}
