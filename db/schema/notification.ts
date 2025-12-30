import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { note } from "./note";

export const notification = pgTable("notification", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'new_note', 'new_follower', etc.
    message: text("message").notNull(),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    noteId: integer("note_id").references(() => note.id, { onDelete: "cascade" }),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
    user: one(user, {
        fields: [notification.userId],
        references: [user.id],
        relationName: "notifications",
    }),
    actor: one(user, {
        fields: [notification.actorId],
        references: [user.id],
        relationName: "actor",
    }),
    note: one(note, {
        fields: [notification.noteId],
        references: [note.id],
    }),
}));

export type Notification = typeof notification.$inferSelect;

export type NotificationWithRelations = Notification & {
    actor: {
        id: string;
        name: string;
        image: string | null;
    } | null;
    note: {
        id: number;
        title: string;
    } | null;
};
