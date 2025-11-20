import {integer, pgTable, serial, varchar, timestamp, text, index} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {user} from "@/db/schema/auth-schema";
import {note} from "@/db/schema/note";

export const userPoints = pgTable("user_points", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}).unique(),
    totalPoints: integer("total_points").notNull().default(0),
    notesCreated: integer("notes_created").notNull().default(0),
    rank: integer("rank"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("user_points_total_idx").on(table.totalPoints.desc()),
    index("user_points_rank_idx").on(table.rank),
]);

export const pointsTransaction = pgTable("points_transaction", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    noteId: integer("note_id").references(() => note.id, {onDelete: "cascade"}),
    points: integer("points").notNull(),
    reason: varchar("reason", {length: 255}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("points_transaction_user_idx").on(table.userId),
    index("points_transaction_note_idx").on(table.noteId),
    index("points_transaction_created_idx").on(table.createdAt.desc()),
]);

export const userPointsRelations = relations(userPoints, ({one}) => ({
    user: one(user, {
        fields: [userPoints.userId],
        references: [user.id],
    }),
}));

export const pointsTransactionRelations = relations(pointsTransaction, ({one}) => ({
    user: one(user, {
        fields: [pointsTransaction.userId],
        references: [user.id],
    }),
    note: one(note, {
        fields: [pointsTransaction.noteId],
        references: [note.id],
    }),
}));

export type LeaderboardEntry = UserPoints & {
    user: {
        id: string;
        name: string;
        image: string | null;
    }
}

export type UserPoints = typeof userPoints.$inferSelect;
export type PointsTransaction = typeof pointsTransaction.$inferSelect;
