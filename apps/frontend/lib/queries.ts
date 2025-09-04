import { db } from "@repo/db";
import { passwordResetToken, user, verificationToken } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { generateHashedPassword } from "./utils";

/**
 * Create a user
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user
 */
export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    console.log("An error occured trying to create user", error);
    throw new Error("Failed to create user");
  }
}

/**
 * Get a verification token by token
 * @param token - The token to get the verification token for
 * @returns The verification token
 */
export async function getVerificationTokenByToken(token: string) {
  try {
    const [foundVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));
    return foundVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by token",
      error
    );
    return null;
  }
}

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

/**
 * Get a password reset token by email
 * @param email - The email to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));
    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by email",
      error
    );
    return null;
  }
}

/**
 * Get a verification token by email
 * @param email - The email to get the verification token for
 * @returns The verification token
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [userVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));
    return userVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by email",
      error
    );
    return null;
  }
};

/**
 * Get a password reset token by token
 * @param token - The token to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByToken(token: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by token",
      error
    );
    return null;
  }
}
