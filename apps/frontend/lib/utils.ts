import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { auth } from "../auth";
import { redirect } from "next/navigation";

/**
 * Merges class names
 * @param inputs - The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a hashed password
 * @param password
 * @returns
 */
export function generateHashedPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}

// Helper function to check if URL is a video
export const isVideo = (url: string) => {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
};

// Helper function to get first image from media array, or first item if no images
export const getPreviewMedia = (media: string[] | null) => {
  if (!media || media.length === 0) return null;

  // Try to find first image
  const firstImage = media.find((url) => !isVideo(url));

  // Return first image if found, otherwise return first item (could be video)
  return firstImage || media[0];
};
