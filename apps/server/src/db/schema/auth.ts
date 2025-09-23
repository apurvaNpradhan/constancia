import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { space } from "./space";
export const user = pgTable("user", {
   id: uuid("id").primaryKey(),
   name: text("name").notNull(),
   email: text("email").notNull().unique(),
   emailVerified: boolean("email_verified").notNull(),
   image: text("image"),
   role: text("role"),
   isOnboarded: boolean("is_onboarding").default(false).notNull(),
   banned: boolean("banned"),
   banReason: text("ban_reason"),
   banExpires: timestamp("ban_expires"),
   createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
   updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
});

export const session = pgTable("session", {
   id: uuid("id").primaryKey(),
   expiresAt: timestamp("expires_at").notNull(),
   token: text("token").notNull().unique(),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
   ipAddress: text("ip_address"),
   userAgent: text("user_agent"),
   userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
   impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
   id: uuid("id").primaryKey(),
   accountId: text("account_id").notNull(),
   providerId: text("provider_id").notNull(),
   userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
   accessToken: text("access_token"),
   refreshToken: text("refresh_token"),
   idToken: text("id_token"),
   accessTokenExpiresAt: timestamp("access_token_expires_at"),
   refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
   scope: text("scope"),
   password: text("password"),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
   id: uuid("id").primaryKey(),
   identifier: text("identifier").notNull(),
   value: text("value").notNull(),
   expiresAt: timestamp("expires_at").notNull(),
   createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
   updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const userRelations = relations(user, ({ one, many }) => ({
   sessions: many(session),
   accounts: many(account),
   spaces: many(space),
}));

export const sessionRelations = relations(session, ({ one }) => ({
   user: one(user, {
      fields: [session.userId],
      references: [user.id],
   }),
}));

export const accountRelations = relations(account, ({ one }) => ({
   user: one(user, {
      fields: [account.userId],
      references: [user.id],
   }),
}));
