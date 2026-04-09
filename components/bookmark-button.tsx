"use client"

import { Bookmark } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import toggleBookmark from "@/actions/bookmarks/toggle-bookmark";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    noteId: number;
    initialIsBookmarked: boolean;
    currentUserId?: string;
    size?: "sm" | "default";
}

export default function BookmarkButton({
    noteId,
    initialIsBookmarked,
    currentUserId,
    size = "default",
}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isPending, startTransition] = useTransition();

    const handleBookmark = (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!currentUserId) {
            toast.error("Please log in to bookmark notes");
            return;
        }

        const previousState = isBookmarked;
        setIsBookmarked(!isBookmarked);

        startTransition(async () => {
            const result = await toggleBookmark(noteId);

            if (result.success && result.data) {
                setIsBookmarked(result.data.isBookmarked);
                if (result.data.isBookmarked) {
                    toast.success("Note bookmarked! 🔖");
                }
            } else {
                setIsBookmarked(previousState);
                toast.error(!result.success ? result.error : "Failed to update bookmark");
            }
        });
    };

    if (size === "sm") {
        return (
            <button
                onClick={handleBookmark}
                disabled={isPending || !currentUserId}
                className={cn(
                    "flex items-center gap-1.5 group/bookmark transition-all",
                    isPending && "opacity-50"
                )}
                title={isBookmarked ? "Remove bookmark" : "Bookmark this note"}
            >
                <Bookmark
                    className={cn(
                        "w-3.5 h-3.5 transition-all",
                        isBookmarked
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground group-hover/bookmark:text-amber-500"
                    )}
                />
            </button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            disabled={isPending || !currentUserId}
            className={cn(
                "flex items-center gap-2 rounded-full px-4 transition-all hover:scale-105",
                isBookmarked
                    ? "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20"
                    : "hover:bg-muted hover:text-amber-500"
            )}
        >
            <Bookmark
                className={cn(
                    "w-5 h-5 transition-all",
                    isBookmarked ? "fill-amber-500 text-amber-500 scale-110" : "text-muted-foreground"
                )}
            />
            <span className="text-sm font-semibold">
                {isBookmarked ? "Saved" : "Save"}
            </span>
        </Button>
    );
}
