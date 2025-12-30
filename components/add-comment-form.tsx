"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import addComment from "@/actions/notes/add-comment";
import { toast } from "sonner";
import { NoteCommentWithUser } from "@/db/schema/note";

interface AddCommentFormProps {
    noteId: number;
    onCommentAdded: (comment: NoteCommentWithUser) => void;
}

export default function AddCommentForm({ noteId, onCommentAdded }: AddCommentFormProps) {
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        if (content.length > 500) {
            toast.error("Comment must be less than 500 characters");
            return;
        }

        startTransition(async () => {
            const result = await addComment(noteId, content);

            if (result.success && result.data) {
                setContent("");
                toast.success("Comment added successfully");
                onCommentAdded(result.data);
            } else {
                toast.error(!result.success ? result.error : "Failed to add comment");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Add a comment..."
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                disabled={isPending}
                className="min-h-[80px] resize-none"
                maxLength={500}
            />

            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {content.length}/500
                </span>

                <Button
                    type="submit"
                    size="sm"
                    disabled={isPending || !content.trim()}
                    className="gap-2"
                >
                    <Send className="w-4 h-4" />
                    Post Comment
                </Button>
            </div>
        </form>
    );
}
