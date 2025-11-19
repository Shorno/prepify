import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {department} from "@/db/schema/department";

export const course = pgTable("course", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    courseCode: varchar("course_code", { length: 50 }).notNull().unique(),
    departmentId: integer("department_id").notNull().references(() => department.id),
});

export const courseRelations = relations(course, ({ one }) => ({
    department: one(department, {
        fields: [course.departmentId],
        references: [department.id],
    }),
}));


export type Course = typeof course.$inferSelect