"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { bookmark, collection } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

export async function addToCollection(
    noteId: number,
    collectionId: number | null
): Promise<ActionResult<null>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in",
            };
        }

        // If assigning to a collection, verify collection ownership
        if (collectionId !== null) {
            const col = await db.query.collection.findFirst({
                where: and(
                    eq(collection.id, collectionId),
                    eq(collection.userId, session.user.id)
                ),
            });

            if (!col) {
                return {
                    status: 404,
                    success: false,
                    error: "Collection not found",
                };
            }
        }

        // Find the bookmark
        const existingBookmark = await db.query.bookmark.findFirst({
            where: and(
                eq(bookmark.noteId, noteId),
                eq(bookmark.userId, session.user.id)
            ),
        });

        if (!existingBookmark) {
            return {
                status: 404,
                success: false,
                error: "Bookmark not found. Please bookmark this note first.",
            };
        }

        // Update the bookmark's collection
        await db.update(bookmark)
            .set({ collectionId })
            .where(eq(bookmark.id, existingBookmark.id));

        return {
            status: 200,
            success: true,
            data: null,
            message: collectionId ? "Added to collection!" : "Removed from collection",
        };
    } catch (error) {
        console.error("Error adding to collection:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to update collection",
        };
    }
}
