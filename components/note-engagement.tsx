"use client"

import { Heart, Eye } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import likeNote from "@/actions/notes/like-note";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NoteEngagementProps {
    noteId: number;
    initialLikesCount: number;
    initialIsLiked: boolean;
    viewsCount: number;
    currentUserId?: string;
}

export default function NoteEngagement({
    noteId,
    initialLikesCount,
    initialIsLiked,
    viewsCount,
    currentUserId
}: NoteEngagementProps) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isPending, startTransition] = useTransition();

    const handleLike = () => {
        if (!currentUserId) {
            toast.error("Please log in to like notes");
            return;
        }

        // Optimistic update
        const previousLikesCount = likesCount;
        const previousIsLiked = isLiked;

        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

        startTransition(async () => {
            const result = await likeNote(noteId);

            if (result.success && result.data) {
                setIsLiked(result.data.isLiked);
                setLikesCount(result.data.likesCount);
            } else {
                // Revert on error
                setIsLiked(previousIsLiked);
                setLikesCount(previousLikesCount);
                toast.error(!result.success ? result.error : "Failed to update like");
            }
        });
    };

    return (
        <div className="flex items-center gap-4">
            {/* Like Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isPending || !currentUserId}
                className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
                <Heart
                    className={cn(
                        "w-5 h-5 transition-all",
                        isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )}
                />
                <span className="text-sm font-medium">{likesCount}</span>
            </Button>

            {/* Views Display */}
            <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">{viewsCount}</span>
            </div>
        </div>
    );
}
