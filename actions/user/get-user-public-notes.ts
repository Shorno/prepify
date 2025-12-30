"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { note, file } from "@/db/schema/note";
import { user } from "@/db/schema/auth-schema";
import { course } from "@/db/schema/course";
import { department } from "@/db/schema/department";
import { eq, desc } from "drizzle-orm";

type UserNote = {
    id: number;
    title: string;
    createdAt: Date;
    course: { name: string };
    department: { departmentCode: string };
    files: { url: string }[];
};

export default async function getUserPublicNotes(userId: string): Promise<ActionResult<UserNote[]>> {
    try {
        const notes = await db.query.note.findMany({
            where: eq(note.userId, userId),
            orderBy: [desc(note.createdAt)],
            with: {
                course: true,
                department: true,
                files: true,
            },
            limit: 12,
        });

        return {
            success: true,
            status: 200,
            data: notes.map((n) => ({
                id: n.id,
                title: n.title,
                createdAt: n.createdAt,
                course: { name: n.course.name },
                department: { departmentCode: n.department.departmentCode },
                files: n.files.map((f) => ({ url: f.url })),
            })),
        };
    } catch (error) {
        console.error("Error getting user public notes:", error);
        return {
            success: false,
            status: 500,
            error: "Failed to get notes",
        };
    }
}
