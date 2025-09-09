import { db } from "@repo/db";
import {
  passwordResetToken,
  project,
  projectTags,
  tags,
  user,
  verificationToken,
} from "@repo/db/schema";
import { eq, and, or, ilike, inArray, desc, count, sql } from "drizzle-orm";
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

/**
 * Get a project by id
 * @param projectId - The id of the project
 * @returns The project
 */
export async function getProjectById(projectId: string) {
  try {
    return await db.select().from(project).where(eq(project.id, projectId));
  } catch (error) {
    console.log("An error occured trying to get project by id", error);
    return null;
  }
}

/**
 * Get a user's projects
 * @param userId - The id of the user
 * @returns The user's projects
 */
export async function getUserProjects(userId: string) {
  try {
    return await db.select().from(project).where(eq(project.userId, userId));
  } catch (error) {
    console.log("An error occured trying to get user projects", error);
    return null;
  }
}

/**
 * Get all tags
 * @returns
 */
export async function getAllTags() {
  try {
    return await db.select().from(tags);
  } catch (error) {
    console.log("An error occured trying to get all tags", error);
    return null;
  }
}

/**
 * Get all projects
 * @returns All projects
 */
export async function getAllProjects() {
  try {
    return await db.select().from(project);
  } catch (error) {
    console.log("An error occured trying to get all projects", error);
    return null;
  }
}

/**
 * Get all projects with their corresponding tag names
 * @returns All projects with their tags (flat structure - one row per project-tag combination)
 */
export async function getAllProjectsWithTags() {
  try {
    return await db
      .select({
        project: project,
        tagName: tags.name,
      })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id));
  } catch (error) {
    console.log("An error occured trying to get all projects with tags", error);
    return null;
  }
}

/**
 * Get all projects with their tags grouped
 * @returns All projects with their tags grouped by project
 */
export async function getAllProjectsWithTagsGrouped() {
  try {
    const results = await db
      .select({
        project: project,
        tagName: tags.name,
      })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id));

    // Group tags by project
    const groupedResults = results.reduce(
      (acc, row) => {
        const projectId = row.project.id;

        if (!acc[projectId]) {
          acc[projectId] = {
            ...row.project,
            tags: [],
          };
        }

        if (row.tagName) {
          acc[projectId].tags.push(row.tagName);
        }

        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(groupedResults);
  } catch (error) {
    console.log(
      "An error occured trying to get all projects with tags grouped",
      error
    );
    return null;
  }
}

/**
 * Get filtered projects by tags and search query
 * @param filterTags - The tag IDs to filter by (string or array of strings)
 * @param query - The search query for project name or description
 * @param offset - The offset for pagination
 * @param limit - The limit for pagination
 * @returns The filtered projects with pagination info
 */
export async function getFilteredProjects(
  filterTags?: string | string[],
  query?: string,
  offset?: number,
  limit?: number
) {
  try {
    // Normalize filterTags to an array of tag ID strings
    const tagIdArray: string[] =
      typeof filterTags === "string"
        ? [filterTags]
        : Array.isArray(filterTags)
          ? filterTags
          : [];

    // Build where conditions
    const conditions = [];

    // Add search query condition
    if (query) {
      conditions.push(
        or(
          ilike(project.name, `%${query}%`),
          ilike(project.description, `%${query}%`)
        )
      );
    }

    // Add tags filter condition
    if (tagIdArray.length > 0) {
      // Get project IDs that have any of the specified tag IDs
      const projectIdsWithTags = await db
        .selectDistinct({ projectId: projectTags.projectId })
        .from(projectTags)
        .where(inArray(projectTags.tagId, tagIdArray));

      const projectIds = projectIdsWithTags
        .map((p) => p.projectId)
        .filter((id): id is string => id !== null);

      if (projectIds.length > 0) {
        conditions.push(inArray(project.id, projectIds));
      } else {
        // If no projects match the tags, return empty result
        return { projects: [], totalPages: 0, totalProjects: 0 };
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get filtered projects with their tags
    const filteredProjects = await db
      .select({
        id: project.id,
        name: project.name,
        link: project.link,
        description: project.description,
        coverImage: project.coverImage,
        logoImage: project.logoImage,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        tagName: tags.name,
      })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id))
      .where(whereClause)
      .orderBy(desc(project.createdAt))
      .limit(limit ?? 10)
      .offset(offset ?? 0);

    // Get total count for pagination
    const totalResult = await db
      .select({ total: count(sql`DISTINCT ${project.id}`) })
      .from(project)
      .leftJoin(projectTags, eq(project.id, projectTags.projectId))
      .leftJoin(tags, eq(projectTags.tagId, tags.id))
      .where(whereClause);

    const total = totalResult[0]?.total ?? 0;
    const totalPages = Math.ceil(Number(total) / (limit ?? 10));

    // Group projects with their tags
    const groupedProjects = filteredProjects.reduce(
      (acc, row) => {
        const projectId = row.id;

        if (!acc[projectId]) {
          acc[projectId] = {
            id: row.id,
            name: row.name,
            link: row.link,
            description: row.description,
            coverImage: row.coverImage,
            logoImage: row.logoImage,
            userId: row.userId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            tags: [],
          };
        }

        if (row.tagName) {
          acc[projectId].tags.push(row.tagName);
        }

        return acc;
      },
      {} as Record<string, any>
    );

    return {
      projects: Object.values(groupedProjects),
      totalPages,
      totalProjects: total,
    };
  } catch (error) {
    console.error("An error occurred trying to get filtered projects", error);
    return { projects: [], totalPages: 0, totalProjects: 0 };
  }
}
