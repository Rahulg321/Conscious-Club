import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get a user by id
 * @param id - The id of the user
 * @returns The user
 */
export async function getUserById(id: string) {
  try {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    console.log("An error occured trying to get user by id", error);
    return null;
  }
}

/**
 * Get a user by email
 * @param email - The email of the user
 * @returns The user
 */
export async function getUserByEmail(email: string) {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
}

/**
 * Update user email verification status
 * @param userId - The id of the user
 * @param emailVerified - The verification timestamp (null to unverify, Date to verify)
 * @returns The updated user
 */
export async function updateUserEmailVerification(
  userId: string,
  emailVerified: Date | null
) {
  try {
    const [updatedUser] = await db
      .update(user)
      .set({
        emailVerified,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user email verification", error);
    return null;
  }
}
