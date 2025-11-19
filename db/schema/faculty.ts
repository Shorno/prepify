import {pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {department} from "./department";

export const faculty = pgTable("faculty", {
    id: serial("id").primaryKey(),
    name : varchar("name", {length : 100}).notNull().unique(),
    facultyCode : varchar("faculty_code", {length : 20}).notNull().unique(),
})

export const facultyRelations = relations(faculty, ({ many }) => ({
    departments: many(department),
}));

export type Faculty = typeof faculty.$inferSelect