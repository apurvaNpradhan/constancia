import {
   boolean,
   index,
   jsonb,
   pgTable,
   text,
   timestamp,
   unique,
   uuid,
   varchar,
   type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { user } from "./auth";
import { relations, sql } from "drizzle-orm";

export const note = pgTable(
   "note",
   {
      id: uuid("id").primaryKey().$defaultFn(uuidv7),
      userId: uuid("user_id")
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      title: varchar("title", { length: 255 }),
      content: jsonb("content").$type<JSON>(),
      isFavorite: boolean("is_favorite").notNull().default(false),
      isTrashed: boolean("is_trashed").notNull().default(false),
      parentId: uuid("parent_id").references((): AnyPgColumn => note.id),
      createdAt: timestamp("created_at", {
         mode: "string",
      }).defaultNow(),
      updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).$onUpdateFn(
         () => sql`now()`
      ),
   },
   (table) => [
      {
         userIdIdx: index("note_user_id_idx").on(table.userId),
         titleIdx: index("note_title_idx").on(table.title),
         createdAtIdx: index("note_created_at_idx").on(table.createdAt),
         parentIdIdx: index("note_parent_id_idx").on(table.parentId),
      },
   ]
);

export const links = pgTable(
   "links",
   {
      id: uuid("id").primaryKey().$defaultFn(uuidv7),
      sourceNoteId: uuid("source_note_id")
         .notNull()
         .references(() => note.id, { onDelete: "cascade" }),
      targetNoteId: uuid("target_note_id")
         .notNull()
         .references(() => note.id, { onDelete: "cascade" }),
      linkType: varchar("link_type", { length: 50 }).notNull().default("reference"),
      anchorText: text("anchor_text"),
      context: text("context"),
      isAutomatic: boolean("is_automatic").default(false),
      createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
      updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).$onUpdateFn(
         () => sql`now()`
      ),
   },
   (table) => [
      {
         sourceTargetUnique: unique("links_source_target_unique").on(
            table.sourceNoteId,
            table.targetNoteId
         ),
         sourceNoteIdx: index("links_source_note_idx").on(table.sourceNoteId),
         targetNoteIdx: index("links_target_note_idx").on(table.targetNoteId),
      },
   ]
);

export const noteMetadata = pgTable(
   "note_metadata",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      noteId: uuid("note_id")
         .notNull()
         .references(() => note.id, { onDelete: "cascade" }),
      key: varchar("key", { length: 100 }).notNull(),
      value: jsonb("value").$type<any>(),
      dataType: varchar("data_type", { length: 20 }).notNull().default("string"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow(),
   },
   (table) => [
      {
         noteKeyUnique: unique("note_metadata_note_key_unique").on(table.noteId, table.key),
         noteIdIdx: index("note_metadata_note_id_idx").on(table.noteId),
      },
   ]
);

export const notesRelations = relations(note, ({ one, many }) => ({
   user: one(user, {
      fields: [note.userId],
      references: [user.id],
   }),
   parent: one(note, {
      fields: [note.parentId],
      references: [note.id],
   }),
   children: many(note),
   outgoingLinks: many(links, { relationName: "outgoing" }),
   backlinks: many(links, { relationName: "backlink" }),
   metadata: many(noteMetadata),
}));

export const linksRelations = relations(links, ({ one }) => ({
   sourceNote: one(note, {
      fields: [links.sourceNoteId],
      references: [note.id],
      relationName: "outgoing",
   }),
   targetNote: one(note, {
      fields: [links.targetNoteId],
      references: [note.id],
      relationName: "backlink",
   }),
}));

export const noteMetadataRelations = relations(noteMetadata, ({ one }) => ({
   note: one(note, {
      fields: [noteMetadata.noteId],
      references: [note.id],
   }),
}));
