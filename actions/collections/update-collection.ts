"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { collection } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

export async function updateCollection(
    collectionId: number,
    data: {
        name?: string;
        description?: string;
        isPublic?: boolean;
    }
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

        await db.update(collection)
            .set({
                ...(data.name !== undefined && { name: data.name.trim() }),
                ...(data.description !== undefined && { description: data.description.trim() || null }),
                ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
            })
            .where(eq(collection.id, collectionId));

        return {
            status: 200,
            success: true,
            data: null,
            message: "Collection updated!",
        };
    } catch (error) {
        console.error("Error updating collection:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to update collection",
        };
    }
}
