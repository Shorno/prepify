import { integer, pgTable, serial, varchar, timestamp, text, pgEnum, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { note } from "@/db/schema/note";

export const aiExplanationStatusEnum = pgEnum("ai_explanation_status", [
    "generating",
    "ready",
    "failed"
]);

export const aiExplanation = pgTable("ai_explanation", {
    id: serial("id").primaryKey(),
    noteId: integer("note_id").notNull().references(() => note.id, { onDelete: "cascade" }).unique(),
    summary: text("summary"),
    steps: json("steps").$type<{ stepNumber: number; title: string; content: string }[]>(),
    keyConcepts: json("key_concepts").$type<{ name: string; description: string }[]>(),
    observations: text("observations"),
    topics: json("topics").$type<string[]>(),
    modelUsed: varchar("model_used", { length: 100 }),
    status: aiExplanationStatusEnum("status").default("generating").notNull(),
    regenerateCount: integer("regenerate_count").default(0).notNull(),
    generatedAt: timestamp("generated_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiExplanationRelations = relations(aiExplanation, ({ one }) => ({
    note: one(note, {
        fields: [aiExplanation.noteId],
        references: [note.id],
    }),
}));

export type AIExplanationRecord = typeof aiExplanation.$inferSelect;
