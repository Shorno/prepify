"use server"

import { ActionResult } from "@/types/action-response";
import { NotesWithRelations } from "@/db/schema/note";
import { db } from "@/db/config";

export default async function getNoteById(noteId: number): Promise<ActionResult<NotesWithRelations>> {
    try {
        const note = await db.query.note.findFirst({
            where: (n, { eq }) => eq(n.id, noteId),
            with: {
                user: true,
                course: true,
                department: true,
                faculty: true,
                resources: true,
                files: true,
                likes: true,
                comments: {
                    with: {
                        user: true,
                    },
                },
            }
        });

        if (!note) {
            return {
                status: 404,
                success: false,
                error: "Note not found"
            }
        }

        return {
            status: 200,
            success: true,
            data: note,
        }

    } catch (error) {
        console.error("Error fetching note:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to fetch note. Please try again.",
        }
    }
}

