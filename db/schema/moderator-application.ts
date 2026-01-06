import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const applicationStatusEnum = pgEnum("application_status", [
    "pending",
    "approved",
    "rejected"
]);

export const moderatorApplication = pgTable("moderator_application", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    status: applicationStatusEnum("status").default("pending").notNull(),
    agreedToRules: boolean("agreed_to_rules").default(false).notNull(),
    motivation: text("motivation"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by").references(() => user.id),
    rejectionReason: text("rejection_reason"),
});

export type ModeratorApplication = typeof moderatorApplication.$inferSelect;
export type NewModeratorApplication = typeof moderatorApplication.$inferInsert;
