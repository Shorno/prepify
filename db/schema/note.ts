
import { integer, pgTable, serial, varchar, timestamp, text, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Course, course } from "@/db/schema/course";
import { Faculty, faculty } from "@/db/schema/faculty";
import { Department, department } from "@/db/schema/department";
import { User, user } from "@/db/schema/auth-schema";

export const note = pgTable("note", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    courseId: integer("course_id").notNull().references(() => course.id, { onDelete: "cascade" }),
    departmentId: integer("department_id").notNull().references(() => department.id, { onDelete: "cascade" }),
    facultyId: integer("faculty_id").notNull().references(() => faculty.id, { onDelete: "cascade" }),
    viewsCount: integer("views_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resource = pgTable("resource", {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 2048 }).notNull(),
    noteId: integer("note_id").notNull().references(() => note.id, { onDelete: "cascade" }),
});

export const file = pgTable("file", {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 2048 }).notNull(),
    noteId: integer("note_id").notNull().references(() => note.id, { onDelete: "cascade" }),
});

export const noteLike = pgTable("note_like", {
    id: serial("id").primaryKey(),
    noteId: integer("note_id").notNull().references(() => note.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    uniqueUserNote: unique().on(table.noteId, table.userId),
}));

export const noteComment = pgTable("note_comment", {
    id: serial("id").primaryKey(),
    noteId: integer("note_id").notNull().references(() => note.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const noteRelations = relations(note, ({ one, many }) => ({
    user: one(user, {
        fields: [note.userId],
        references: [user.id],
    }),
    course: one(course, {
        fields: [note.courseId],
        references: [course.id],
    }),
    department: one(department, {
        fields: [note.departmentId],
        references: [department.id],
    }),
    faculty: one(faculty, {
        fields: [note.facultyId],
        references: [faculty.id],
    }),
    resources: many(resource),
    files: many(file),
    likes: many(noteLike),
    comments: many(noteComment),
}));

export const resourceRelations = relations(resource, ({ one }) => ({
    note: one(note, {
        fields: [resource.noteId],
        references: [note.id],
    }),
}));

export const fileRelations = relations(file, ({ one }) => ({
    note: one(note, {
        fields: [file.noteId],
        references: [note.id],
    }),
}));


export type Note = typeof note.$inferSelect;
export type Resource = typeof resource.$inferSelect;
export type File = typeof file.$inferSelect;
export type NoteLike = typeof noteLike.$inferSelect;
export type NoteComment = typeof noteComment.$inferSelect;

export type NoteCommentWithUser = NoteComment & {
    user: User
};

export type NotesWithRelations = Note & {
    user: User
    course: Course
    department: Department
    faculty: Faculty
    resources: Resource[]
    files: File[]
    likes: NoteLike[]
    comments: NoteCommentWithUser[]
};

export const noteLikeRelations = relations(noteLike, ({ one }) => ({
    note: one(note, {
        fields: [noteLike.noteId],
        references: [note.id],
    }),
    user: one(user, {
        fields: [noteLike.userId],
        references: [user.id],
    }),
}));

export const noteCommentRelations = relations(noteComment, ({ one }) => ({
    note: one(note, {
        fields: [noteComment.noteId],
        references: [note.id],
    }),
    user: one(user, {
        fields: [noteComment.userId],
        references: [user.id],
    }),
}));
