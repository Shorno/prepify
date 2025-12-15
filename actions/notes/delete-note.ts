"use server"

import { checkAuth } from "@/app/actions/user/checkAuth";
import { ActionResult } from "@/types/action-response";
import { note } from "@/db/schema/note";
import { eq } from "drizzle-orm";
import { db } from "@/db/config";
import { revalidatePath } from "next/cache";

export default async function deleteNote(noteId: number): Promise<ActionResult<void>> {

    const session = await checkAuth()

    if (!session?.user) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
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
                error: "You don't have permission to delete this note",
            };
        }

        // Delete the note (cascade will handle files and resources)
        await db.delete(note).where(eq(note.id, noteId));

        revalidatePath("/my-notes");
        revalidatePath("/notes");

        return {
            success: true,
            status: 200,
            data: undefined,
            message: "Note deleted successfully!",
        };

    } catch (error) {
        console.error("Error deleting note:", error);

        return {
            success: false,
            status: 500,
            error: "Failed to delete note. Please try again.",
        };
    }
}
