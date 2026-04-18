import { pgTable, serial, text, varchar, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const userStreak = pgTable("user_streak", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastActiveDate: varchar("last_active_date", { length: 10 }), // YYYY-MM-DD
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const badge = pgTable("badge", {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 50 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(), // upload, streak, engagement, social
    threshold: integer("threshold").notNull(),
});

export const userBadge = pgTable("user_badge", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    badgeId: integer("badge_id").notNull().references(() => badge.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
}, (table) => ({
    uniqueUserBadge: unique().on(table.userId, table.badgeId),
}));

// Relations
export const userStreakRelations = relations(userStreak, ({ one }) => ({
    user: one(user, {
        fields: [userStreak.userId],
        references: [user.id],
    }),
}));

export const badgeRelations = relations(badge, ({ many }) => ({
    userBadges: many(userBadge),
}));

export const userBadgeRelations = relations(userBadge, ({ one }) => ({
    user: one(user, {
        fields: [userBadge.userId],
        references: [user.id],
    }),
    badge: one(badge, {
        fields: [userBadge.badgeId],
        references: [badge.id],
    }),
}));

export type UserStreak = typeof userStreak.$inferSelect;
export type Badge = typeof badge.$inferSelect;
export type UserBadge = typeof userBadge.$inferSelect;

export type UserBadgeWithBadge = UserBadge & {
    badge: Badge;
};
