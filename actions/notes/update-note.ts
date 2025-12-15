"use server"

import { NoteFormData, noteSchema } from "@/zodSchema/noteSchema";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { note, file, resource } from "@/db/schema/note";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/config";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export default async function updateNote(
    noteId: number,
    data: NoteFormData
): Promise<ActionResult<{ noteId: number }>> {

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

        const validData = result.data;

        // Check if note exists and user owns it
        const existingNote = await db.query.note.findFirst({
            where: (note, { eq }) => eq(note.id, noteId),
        });

        if (!existingNote) {
            return {
                success: false,
                status: 404,
                error: "Note not found",
            };
        }

        if (existingNote.userId !== session.user.id) {
            return {
                success: false,
                status: 403,
                error: "You don't have permission to edit this note",
            };
        }

        await db.transaction(async (tx) => {
            // Update the note
            await tx.update(note)
                .set({
                    title: validData.title,
                    courseId: parseInt(validData.courseId),
                    departmentId: parseInt(validData.departmentId),
                    facultyId: parseInt(validData.facultyId),
                    updatedAt: new Date(),
                })
                .where(eq(note.id, noteId));

            // Delete existing files and resources
            await tx.delete(file).where(eq(file.noteId, noteId));
            await tx.delete(resource).where(eq(resource.noteId, noteId));

            // Insert new files if any
            if (validData.files && validData.files.length > 0) {
                const fileValues = validData.files.map((fileUrl) => ({
                    url: fileUrl,
                    noteId: noteId,
                }));
                await tx.insert(file).values(fileValues);
            }

            // Insert new resources if any
            if (validData.resources && validData.resources.length > 0) {
                const resourceValues = validData.resources.map((res) => ({
                    url: res.url,
                    noteId: noteId,
                }));
                await tx.insert(resource).values(resourceValues);
            }
        });

        revalidatePath("/my-notes");
        revalidatePath(`/my-notes/${noteId}`);
        revalidatePath("/notes");

        return {
            success: true,
            status: 200,
            data: {
                noteId,
            },
            message: "Note updated successfully! 🎉",
        };

    } catch (error) {
        console.error("Error updating note:", error);

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
            error: "Failed to update note. Please try again.",
        };
    }
}
