"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { note } from "@/db/schema/note";
import { eq, sql } from "drizzle-orm";

export default async function incrementView(noteId: number): Promise<ActionResult<{ viewsCount: number }>> {
    try {
        // Increment the view count
        const [updatedNote] = await db
            .update(note)
            .set({
                viewsCount: sql`${note.viewsCount} + 1`,
            })
            .where(eq(note.id, noteId))
            .returning();

        if (!updatedNote) {
            return {
                status: 404,
                success: false,
                error: "Note not found",
            };
        }

        return {
            status: 200,
            success: true,
            data: {
                viewsCount: updatedNote.viewsCount,
            },
        };
    } catch (error) {
        console.error("Error incrementing view:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to increment view count. Please try again.",
        };
    }
}
