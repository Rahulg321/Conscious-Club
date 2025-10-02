import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  primaryKey,
  boolean,
  integer,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const userType = pgEnum("userType", [
  "explorer",
  "creator",
  "organizer",
]);

export const genderType = pgEnum("gender", [
  "male",
  "female",
  "prefer_not_to_say",
]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  bio: text("bio"),
  bannerImage: text("bannerImage"),
  type: userType("type"),
  dateOfBirth: timestamp("dateOfBirth", { mode: "date" }),
  gender: genderType("gender"),
  socialUrl: text("socialUrl"),
  location: text("location"),
  discipline: text("discipline"),
  role: text("role"),
  fun: text("fun"),
  onboardingCompleted: boolean("onboardingCompleted").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const twoFactorConfirmation = pgTable("two_factor_confirmation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
});

export type TwoFactorConfirmation = InferSelectModel<
  typeof twoFactorConfirmation
>;

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("password_reset_token_email_token_unique").on(
      table.email,
      table.token
    ),
  })
);

export type PasswordResetToken = InferSelectModel<typeof passwordResetToken>;

export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("two_factor_token_email_token_unique").on(
      table.email,
      table.token
    ),
  })
);

export type TwoFactorToken = InferSelectModel<typeof twoFactorToken>;

export const verificationToken = pgTable(
  "verification_token",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("verification_token_email_token_unique").on(
      table.email,
      table.token
    ),
  })
);

export type VerificationToken = InferSelectModel<typeof verificationToken>;

export const project = pgTable("project", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  link: text("link").notNull(),
  description: text("description").notNull(),
  coverImage: text("coverImage").notNull(),
  logoImage: text("logoImage"),
  userId: uuid("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Project = InferSelectModel<typeof project>;

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export type Tags = InferSelectModel<typeof tags>;

export const projectTags = pgTable(
  "project_tags",
  {
    projectId: uuid("projectId").references(() => project.id, {
      onDelete: "cascade",
    }),
    tagId: uuid("tagId").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.tagId] }),
    projectTagUnique: uniqueIndex("project_tags_project_id_tag_id_unique").on(
      table.projectId,
      table.tagId
    ),
  })
);

export type ProjectTags = InferSelectModel<typeof projectTags>;

export const follows = pgTable(
  "follows",
  {
    // The ID of the user who is performing the follow action
    followerId: uuid("followerId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // The ID of the user who is being followed
    followingId: uuid("followingId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Timestamp for when the follow action occurred
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => ({
    // A composite primary key ensures that a user can only follow another user once.
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  })
);

export type Follows = InferSelectModel<typeof follows>;

export const projectLikes = pgTable(
  "project_likes",
  {
    // The ID of the user who liked the project
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // The ID of the project that was liked
    projectId: uuid("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    // Timestamp for when the like occurred
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => ({
    // A composite primary key ensures a user can only like a specific project once.
    pk: primaryKey({ columns: [table.userId, table.projectId] }),
  })
);

export type ProjectLikes = InferSelectModel<typeof projectLikes>;

export const bravoCategories = pgTable("bravo_categories", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type BravoCategories = InferSelectModel<typeof bravoCategories>;

export const bravos = pgTable("bravos", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  categoryId: uuid("categoryId")
    .references(() => bravoCategories.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Bravos = InferSelectModel<typeof bravos>;
