import {integer, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {course} from "@/db/schema/course";

export const note = pgTable("note", {
    id: serial("id").primaryKey(),
    title : varchar("title", {length : 255}).notNull().unique(),
    courseId: integer("course_id").notNull().references(()=>course.id),
})


export const resource = pgTable("resource", {
    id: serial("id").primaryKey(),
    url : varchar("url", {length : 2048}).notNull(),
    noteId: integer("note_id").notNull().references(()=>note.id),
})

export const file = pgTable("file", {
    id: serial("id").primaryKey(),
    url : varchar("url", {length : 2048}).notNull(),
    noteId: integer("note_id").notNull().references(()=>note.id),
})



