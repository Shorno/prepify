"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { collection, bookmark } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq } from "drizzle-orm";
import { Collection } from "@/db/schema/bookmark";

export type CollectionWithCount = Collection & {
    bookmarkCount: number;
};

export async function getCollections(): Promise<ActionResult<CollectionWithCount[]>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to view collections",
            };
        }

        const userCollections = await db.query.collection.findMany({
            where: eq(collection.userId, session.user.id),
            with: {
                bookmarks: true,
            },
            orderBy: (collection, { desc }) => [desc(collection.updatedAt)],
        });

        const collectionsWithCount: CollectionWithCount[] = userCollections.map((col) => ({
            ...col,
            bookmarkCount: col.bookmarks.length,
        }));

        return {
            status: 200,
            success: true,
            data: collectionsWithCount,
        };
    } catch (error) {
        console.error("Error getting collections:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to get collections",
        };
    }
}
