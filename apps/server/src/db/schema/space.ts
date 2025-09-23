import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { user } from "./auth";
import { note } from "./note";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import type { z } from "better-auth";

export const space = pgTable(
   "space",
   {
      id: uuid("id").primaryKey().$defaultFn(uuidv7),
      userId: uuid("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      color: varchar("color", { length: 50 }),
      //   icon: text("icon"),
      createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
      updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).$onUpdateFn(
         () => sql`now()`
      ),
   },
   (table) => [
      {
         userIdIdx: index("space_user_id_idx").on(table.userId),
         nameIdx: index("space_name_idx").on(table.name),
      },
   ]
);

export const spaceRelations = relations(space, ({ one, many }) => ({
   user: one(user, {
      fields: [space.userId],
      references: [user.id],
   }),
   notes: many(note),
}));

export const SpaceSchema = createSelectSchema(space);
export type Space = z.infer<typeof SpaceSchema>;

export const SpaceInsertSchema = createInsertSchema(space).omit({
   createdAt: true,
   updatedAt: true,
   userId: true,
   id: true,
});
export type SpaceInsert = z.infer<typeof SpaceInsertSchema>;

export const SpaceUpdateSchema = createUpdateSchema(space).omit({
   createdAt: true,
   updatedAt: true,
   userId: true,
   id: true,
});
