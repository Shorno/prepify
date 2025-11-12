import {integer, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {faculty} from "@/db/schema/faculty";
import {relations} from "drizzle-orm";

export const department = pgTable("department", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    departmentCode: varchar("department_code", { length: 50 }).notNull().unique(),
    facultyId: integer("faculty_id").notNull().references(() => faculty.id),
});

export const departmentRelations = relations(department, ({ one }) => ({
    faculty: one(faculty, {
        fields: [department.facultyId],
        references: [faculty.id],
    }),
}));
