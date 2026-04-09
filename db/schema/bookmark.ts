import { pgTable, serial, text, varchar, integer, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { note } from "./note";

export const collection = pgTable("collection", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const bookmark = pgTable("bookmark", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    noteId: integer("note_id").notNull().references(() => note.id, { onDelete: "cascade" }),
    collectionId: integer("collection_id").references(() => collection.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    uniqueUserNote: unique().on(table.userId, table.noteId),
}));

// Relations
export const collectionRelations = relations(collection, ({ one, many }) => ({
    user: one(user, {
        fields: [collection.userId],
        references: [user.id],
    }),
    bookmarks: many(bookmark),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
    user: one(user, {
        fields: [bookmark.userId],
        references: [user.id],
    }),
    note: one(note, {
        fields: [bookmark.noteId],
        references: [note.id],
    }),
    collection: one(collection, {
        fields: [bookmark.collectionId],
        references: [collection.id],
    }),
}));

export type Collection = typeof collection.$inferSelect;
export type NewCollection = typeof collection.$inferInsert;
export type Bookmark = typeof bookmark.$inferSelect;
export type NewBookmark = typeof bookmark.$inferInsert;
