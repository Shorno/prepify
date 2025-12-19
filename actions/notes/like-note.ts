"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { noteLike } from "@/db/schema/note";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

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

            return {
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

            return {
                status: 200,
                success: true,
                data: {
                    isLiked: true,
                    likesCount: likes.length,
                },
                message: "Note liked successfully",
            };
        }
    } catch (error) {
        console.error("Error toggling like:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to update like status. Please try again.",
        };
    }
}
