"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { noteLike, note } from "@/db/schema/note";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";
import { updateStreak } from "@/actions/streaks/update-streak";
import { checkAndAwardBadges } from "@/actions/badges/check-and-award-badges";

export default async function likeNote(noteId: number): Promise<ActionResult<{ isLiked: boolean; likesCount: number }>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to like a note",
            };
        }

        const userId = session.user.id;

        // Check if the user has already liked this note
        const existingLike = await db.query.noteLike.findFirst({
            where: and(
                eq(noteLike.noteId, noteId),
                eq(noteLike.userId, userId)
            ),
        });

        let result: ActionResult<{ isLiked: boolean; likesCount: number }>;

        if (existingLike) {
            // Unlike: delete the like
            await db.delete(noteLike).where(
                and(
                    eq(noteLike.noteId, noteId),
                    eq(noteLike.userId, userId)
                )
            );

            // Get updated count
            const likes = await db.query.noteLike.findMany({
                where: eq(noteLike.noteId, noteId),
            });

            result = {
                status: 200,
                success: true,
                data: {
                    isLiked: false,
                    likesCount: likes.length,
                },
                message: "Note unliked successfully",
            };
        } else {
            // Like: insert a new like
            await db.insert(noteLike).values({
                noteId,
                userId,
            });

            // Get updated count
            const likes = await db.query.noteLike.findMany({
                where: eq(noteLike.noteId, noteId),
            });

            result = {
                status: 200,
                success: true,
                data: {
                    isLiked: true,
                    likesCount: likes.length,
                },
                message: "Note liked successfully",
            };
        }

        // Update streak and check badges for the liker
        updateStreak(userId).catch(console.error);
        checkAndAwardBadges(userId).catch(console.error);

        // Also check badges for the note author (they may have earned engagement badges)
        const likedNote = await db.query.note.findFirst({
            where: eq(note.id, noteId),
            columns: { userId: true },
        });
        if (likedNote && likedNote.userId !== userId) {
            checkAndAwardBadges(likedNote.userId).catch(console.error);
        }

        return result;
    } catch (error) {
        console.error("Error toggling like:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to update like status. Please try again.",
        };
    }
}

