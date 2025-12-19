"use server"

import { ActionResult } from "@/types/action-response";
import { db } from "@/db/config";
import { noteComment, NoteCommentWithUser } from "@/db/schema/note";
import { checkAuth } from "@/app/actions/user/checkAuth";
import { commentSchema } from "@/zodSchema/commentSchema";

export default async function addComment(noteId: number, content: string): Promise<ActionResult<NoteCommentWithUser>> {
    try {
        const session = await checkAuth();

        if (!session?.user) {
            return {
                status: 401,
                success: false,
                error: "You must be logged in to comment",
            };
        }

        // Validate input
        const validation = commentSchema.safeParse({ content, noteId });

        if (!validation.success) {
            return {
                status: 400,
                success: false,
                error: validation.error.issues[0].message,
            };
        }

        const userId = session.user.id;

        // Insert the comment
        const [newComment] = await db.insert(noteComment).values({
            noteId,
            userId,
            content: content.trim(),
        }).returning();

        // Fetch the complete comment with user info
        const commentWithUser = await db.query.noteComment.findFirst({
            where: (comments, { eq }) => eq(comments.id, newComment.id),
            with: {
                user: true,
            },
        });

        if (!commentWithUser) {
            return {
                status: 500,
                success: false,
                error: "Failed to retrieve comment",
            };
        }

        return {
            status: 200,
            success: true,
            data: commentWithUser,
            message: "Comment added successfully",
        };
    } catch (error) {
        console.error("Error adding comment:", error);

        return {
            status: 500,
            success: false,
            error: "Failed to add comment. Please try again.",
        };
    }
}
