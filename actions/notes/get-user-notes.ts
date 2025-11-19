"use server"

import {checkAuth} from "@/app/actions/user/checkAuth";
import {ActionResult} from "@/types/action-response";
import {NotesWithRelations} from "@/db/schema/note";
import {db} from "@/db/config";

export default async function getUserNotes(): Promise<ActionResult<NotesWithRelations[]>> {
    const session = await checkAuth();

    if (!session?.user) {
        return {
            status: 401,
            success: false,
            error: "Unauthorized",
        }
    }

    try {
        const notes = await db.query.note.findMany({
            where: (note, {eq}) => eq(note.userId, session.user.id),
            with: {
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
        console.error("Error fetching user notes:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to fetch notes. Please try again.",
        }
    }
}
