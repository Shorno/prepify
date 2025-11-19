"use server"

import {ActionResult} from "@/types/action-response";
import {NotesWithRelations} from "@/db/schema/note";
import {db} from "@/db/config";

export default async function getPublicNotes(): Promise<ActionResult<NotesWithRelations[]>> {


    try {
        const notes = await db.query.note.findMany({
            with: {
                user : true,
                course: true,
                department: true,
                faculty: true,
                resources: true,
                files: true
            }
        });

        if (!notes || notes.length === 0) {
            return {
                status: 200,
                success: true,
                data: [],
                message: "No notes found"
            }
        }

        return {
            status: 200,
            success: true,
            data: notes,
        }

    } catch (error) {
        console.error("Error fetching  notes:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to fetch notes. Please try again.",
        }
    }
}
