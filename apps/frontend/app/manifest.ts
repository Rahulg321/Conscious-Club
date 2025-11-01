import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ConsciousClubb — Building the Creator economy of tomorrow",
    short_name: "ConsciousClubb",
    description:
      "Join the gamified platform where explorers, creators, organizers, and brands connect through self-expression, play, and rewards.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/CC_Logo_Favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
