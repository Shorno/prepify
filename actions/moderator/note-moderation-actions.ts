"use server";

import {db} from "@/db/config";
import {note} from "@/db/schema";
import {requireRole} from "@/actions/auth/checkAuth";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

// Get all notes pending moderation
export async function getPendingNotes() {
    await requireRole(["moderator", "admin"]);

    return await db.query.note.findMany({
        where: (note, {eq}) => eq(note.status, "pending"),
        orderBy: (note, {asc}) => [asc(note.createdAt)],
        with: {
            user: true,
            course: true,
            department: true,
            faculty: true,
            resources: true,
            files: true,
        }
    });
}

export async function getModeratorNotesStats() {
    await requireRole(["moderator", "admin"]);

    const pendingNotes = await db.query.note.findMany({
        where: (note, { eq }) => eq(note.status, "pending"),
        columns: { id: true }
    });

    return {
        pendingCount: pendingNotes.length
    };
}

export async function approveNote(noteId: number) {
    const session = await requireRole(["moderator", "admin"]);

    const existingNote = await db.query.note.findFirst({
        where: (note, { eq }) => eq(note.id, noteId)
    });

    if (!existingNote) {
        return { success: false, message: "Note not found" };
    }

    if (existingNote.status !== "pending") {
        return { success: false, message: "Note is not pending review" };
    }

    await db
        .update(note)
        .set({
            status: "approved",
            moderatedAt: new Date(),
            moderatedBy: session.user.id,
            rejectionReason: null,
        })
        .where(eq(note.id, noteId));

    revalidatePath("/dashboard/moderator/notes");
    revalidatePath("/notes");

    return { success: true, message: "Note approved successfully" };
}

// Reject a note
export async function rejectNote(noteId: number, reason?: string) {
    const session = await requireRole(["moderator", "admin"]);

    const existingNote = await db.query.note.findFirst({
        where: (note, { eq }) => eq(note.id, noteId)
    });

    if (!existingNote) {
        return { success: false, message: "Note not found" };
    }

    if (existingNote.status !== "pending") {
        return { success: false, message: "Note is not pending review" };
    }

    await db
        .update(note)
        .set({
            status: "rejected",
            moderatedAt: new Date(),
            moderatedBy: session.user.id,
            rejectionReason: reason || null,
        })
        .where(eq(note.id, noteId));

    revalidatePath("/dashboard/moderator/notes");
    revalidatePath("/my-notes");

    return { success: true, message: "Note rejected" };
}

// Get a single note for review (with full details)
export async function getNoteForReview(noteId: number) {
    await requireRole(["moderator", "admin"]);

    return await db.query.note.findFirst({
        where: (note, {eq}) => eq(note.id, noteId),
        with: {
            user: true,
            course: true,
            department: true,
            faculty: true,
            resources: true,
            files: true,
        }
    });
}
