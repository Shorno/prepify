import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const follow = pgTable("follow", {
    followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
}));

export const followRelations = relations(follow, ({ one }) => ({
    follower: one(user, {
        fields: [follow.followerId],
        references: [user.id],
        relationName: "follower",
    }),
    following: one(user, {
        fields: [follow.followingId],
        references: [user.id],
        relationName: "following",
    }),
}));

export type Follow = typeof follow.$inferSelect;
