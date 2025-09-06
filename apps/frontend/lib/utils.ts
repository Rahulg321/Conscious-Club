import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { genSaltSync, hashSync } from "bcrypt-ts";

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
