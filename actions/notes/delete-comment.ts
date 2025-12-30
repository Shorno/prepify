"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { noteComment } from "@/db/schema/note";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { eq, and } from "drizzle-orm";

export default async function deleteComment(commentId: number): Promise<ActionResult<null>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to delete a comment",
            };
        }

        const userId = session.user.id;

        // Check if the comment exists and belongs to the user
        const comment = await db.query.noteComment.findFirst({
            where: eq(noteComment.id, commentId),
        });

        if (!comment) {
            return {
                status: 404,
                success: false,
                error: "Comment not found",
            };
        }

        if (comment.userId !== userId) {
            return {
                status: 403,
                success: false,
                error: "You can only delete your own comments",
            };
        }

        // Delete the comment
        await db.delete(noteComment).where(eq(noteComment.id, commentId));

        return {
            status: 200,
            success: true,
            data: null,
            message: "Comment deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting comment:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to delete comment. Please try again.",
        };
    }
}
