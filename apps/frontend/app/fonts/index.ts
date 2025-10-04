import { Inter, Spectral, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});
