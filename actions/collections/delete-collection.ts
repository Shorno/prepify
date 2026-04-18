"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { collection, bookmark } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

export async function deleteCollection(collectionId: number): Promise<ActionResult<null>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in",
            };
        }

        // Verify ownership
        const existing = await db.query.collection.findFirst({
            where: and(
                eq(collection.id, collectionId),
                eq(collection.userId, session.user.id)
            ),
        });

        if (!existing) {
            return {
                status: 404,
                success: false,
                error: "Collection not found",
            };
        }

        // Set bookmarks in this collection to unsorted (collectionId = null)
        await db.update(bookmark)
            .set({ collectionId: null })
            .where(eq(bookmark.collectionId, collectionId));

        // Delete the collection
        await db.delete(collection).where(eq(collection.id, collectionId));

        return {
            status: 200,
            success: true,
            data: null,
            message: "Collection deleted",
        };
    } catch (error) {
        console.error("Error deleting collection:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to delete collection",
        };
    }
}
