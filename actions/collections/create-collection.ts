"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { collection } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq } from "drizzle-orm";

export async function createCollection(data: {
    name: string;
    description?: string;
    isPublic?: boolean;
}): Promise<ActionResult<{ id: number }>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to create a collection",
            };
        }

        // Check max collections limit (20)
        const existingCollections = await db.query.collection.findMany({
            where: eq(collection.userId, session.user.id),
        });

        if (existingCollections.length >= 20) {
            return {
                status: 400,
                success: false,
                error: "You can have a maximum of 20 collections",
            };
        }

        const [newCollection] = await db.insert(collection).values({
            userId: session.user.id,
            name: data.name.trim(),
            description: data.description?.trim() || null,
            isPublic: data.isPublic ?? false,
        }).returning();

        return {
            status: 201,
            success: true,
            data: { id: newCollection.id },
            message: "Collection created!",
        };
    } catch (error) {
        console.error("Error creating collection:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to create collection",
        };
    }
}
