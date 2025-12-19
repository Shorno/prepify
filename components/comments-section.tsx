"use client"

import { useState, useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { NoteCommentWithUser } from "@/db/schema/note";
import CommentItem from "@/components/comment-item";
import AddCommentForm from "@/components/add-comment-form";
import deleteComment from "@/actions/notes/delete-comment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentsSectionProps {
    noteId: number;
    initialComments: NoteCommentWithUser[];
    currentUserId?: string;
}

export default function CommentsSection({
    noteId,
    initialComments,
    currentUserId
}: CommentsSectionProps) {
    const [comments, setComments] = useState(initialComments);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCommentAdded = (newComment: NoteCommentWithUser) => {
        // Optimistically add the new comment to the list
        setComments([...comments, newComment]);
    };

    const handleDeleteComment = (commentId: number) => {
        // Optimistic update
        const previousComments = comments;
        setComments(comments.filter(c => c.id !== commentId));

        startTransition(async () => {
            const result = await deleteComment(commentId);

            if (result.success) {
                toast.success("Comment deleted successfully");
            } else {
                // Revert on error
                setComments(previousComments);
                toast.error(result.error || "Failed to delete comment");
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Comments Header */}
            <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">
                    Comments ({comments.length})
                </h2>
            </div>

            {/* Add Comment Form */}
            {currentUserId && (
                <div className="pb-4 border-b border-border">
                    <AddCommentForm
                        noteId={noteId}
                        onCommentAdded={handleCommentAdded}
                    />
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-1">
                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    <div className="divide-y divide-border">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                currentUserId={currentUserId}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
