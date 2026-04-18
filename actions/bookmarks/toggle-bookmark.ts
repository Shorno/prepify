"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { bookmark } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

export default async function toggleBookmark(noteId: number): Promise<ActionResult<{ isBookmarked: boolean }>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to bookmark a note",
            };
        }

        const userId = session.user.id;

        // Check if already bookmarked
        const existingBookmark = await db.query.bookmark.findFirst({
            where: and(
                eq(bookmark.noteId, noteId),
                eq(bookmark.userId, userId)
            ),
        });

        if (existingBookmark) {
            // Remove bookmark
            await db.delete(bookmark).where(
                and(
                    eq(bookmark.noteId, noteId),
                    eq(bookmark.userId, userId)
                )
            );

            return {
                status: 200,
                success: true,
                data: { isBookmarked: false },
                message: "Bookmark removed",
            };
        } else {
            // Add bookmark
            await db.insert(bookmark).values({
                noteId,
                userId,
            });

            return {
                status: 200,
                success: true,
                data: { isBookmarked: true },
                message: "Note bookmarked!",
            };
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to update bookmark. Please try again.",
        };
    }
}
