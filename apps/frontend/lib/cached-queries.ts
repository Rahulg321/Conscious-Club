import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

/**
 * Get a user by id using react cache
 * @param id - The id of the user
 * @returns The user
 */
export const getCachedUserById = cache(async (id: string) => {
  try {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    console.log("An error occured trying to get user by id", error);
    return null;
  }
});
