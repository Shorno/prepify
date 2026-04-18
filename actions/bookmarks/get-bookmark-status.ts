"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { bookmark } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

export async function getBookmarkStatus(noteId: number): Promise<ActionResult<{ isBookmarked: boolean }>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 200,
                success: true,
                data: { isBookmarked: false },
            };
        }

        const existingBookmark = await db.query.bookmark.findFirst({
            where: and(
                eq(bookmark.noteId, noteId),
                eq(bookmark.userId, session.user.id)
            ),
        });

        return {
            status: 200,
            success: true,
            data: { isBookmarked: !!existingBookmark },
        };
    } catch (error) {
        console.error("Error getting bookmark status:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to get bookmark status",
        };
    }
}
