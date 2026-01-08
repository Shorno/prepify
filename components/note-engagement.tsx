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
        <div className="flex items-center gap-3">
            {/* Like Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isPending || !currentUserId}
                className={cn(
                    "flex items-center gap-2 rounded-full px-4 transition-all hover:scale-105",
                    isLiked
                        ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                        : "hover:bg-muted hover:text-red-500"
                )}
            >
                <Heart
                    className={cn(
                        "w-5 h-5 transition-all",
                        isLiked ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"
                    )}
                />
                <span className="text-sm font-semibold">{likesCount}</span>
            </Button>

            {/* Views Display */}
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-semibold">{viewsCount}</span>
            </div>
        </div>
    );
}
