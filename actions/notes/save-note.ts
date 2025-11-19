"use server"

import {NoteFormData, noteSchema} from "@/zodSchema/noteSchema";
import {checkAuth} from "@/app/actions/user/checkAuth";
import {ActionResult} from "@/types/action-response";
import {note, file, resource} from "@/db/schema/note";
import {db} from "@/db/config";
import {z} from "zod";

export default async function saveNote(data: NoteFormData): Promise<ActionResult<{noteId: number}>> {

    const session = await checkAuth()

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = noteSchema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }
        const validData = result.data

        const savedNote = await db.transaction(async (tx) => {
            const [newNote] = await tx.insert(note).values({
                userId : session.user.id,
                title: validData.title,
                courseId: parseInt(validData.courseId),
                departmentId: parseInt(validData.departmentId),
                facultyId: parseInt(validData.facultyId),
            }).returning();

            if (!newNote) {
                throw new Error("Failed to create note");
            }

            if (validData.files && validData.files.length > 0) {
                const fileValues = validData.files.map((fileUrl) => ({
                    url: fileUrl,
                    noteId: newNote.id,
                }));

                await tx.insert(file).values(fileValues);
            }

            if (validData.resources && validData.resources.length > 0) {
                const resourceValues = validData.resources.map((res) => ({
                    url: res.url,
                    noteId: newNote.id,
                }));

                await tx.insert(resource).values(resourceValues);
            }

            return newNote;
        });

        return {
            success: true,
            status: 201,
            data: { noteId: savedNote.id },
            message: "Note saved successfully",
        };

    } catch (error) {
        console.error("Error saving note:", error);

        if (error instanceof Error) {
            if (error.message.includes("unique constraint")) {
                return {
                    success: false,
                    status: 409,
                    error: "A note with this title already exists",
                };
            }

            if (error.message.includes("foreign key constraint")) {
                return {
                    success: false,
                    status: 400,
                    error: "Invalid course, department, or faculty ID",
                };
            }
        }

        return {
            success: false,
            status: 500,
            error: "Failed to save note. Please try again.",
        };
    }
}
