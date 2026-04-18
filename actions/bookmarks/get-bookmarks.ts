"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { bookmark } from "@/db/schema/bookmark";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq } from "drizzle-orm";
import { NotesWithRelations } from "@/db/schema/note";

export type BookmarkWithNote = {
    id: number;
    noteId: number;
    collectionId: number | null;
    createdAt: Date;
    note: NotesWithRelations;
};

export async function getBookmarks(collectionId?: number | null): Promise<ActionResult<BookmarkWithNote[]>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to view bookmarks",
            };
        }

        const userBookmarks = await db.query.bookmark.findMany({
            where: collectionId === undefined
                ? eq(bookmark.userId, session.user.id)
                : collectionId === null
                    ? (fields, { and, eq, isNull }) =>
                        and(eq(fields.userId, session.user.id), isNull(fields.collectionId))
                    : (fields, { and, eq }) =>
                        and(eq(fields.userId, session.user.id), eq(fields.collectionId, collectionId)),
            with: {
                note: {
                    with: {
                        user: true,
                        course: true,
                        department: true,
                        faculty: true,
                        resources: true,
                        files: true,
                        likes: true,
                        comments: {
                            with: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: (bookmark, { desc }) => [desc(bookmark.createdAt)],
        });

        return {
            status: 200,
            success: true,
            data: userBookmarks as BookmarkWithNote[],
        };
    } catch (error) {
        console.error("Error getting bookmarks:", error);
        return {
            status: 500,
            success: false,
            error: "Failed to get bookmarks",
        };
    }
}
