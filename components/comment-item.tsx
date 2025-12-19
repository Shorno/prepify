"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { NoteCommentWithUser } from "@/db/schema/note";

interface CommentItemProps {
    comment: NoteCommentWithUser;
    currentUserId?: string;
    onDelete: (commentId: number) => void;
}

function getTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

export default function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
    const isOwner = currentUserId === comment.userId;

    const userInitials = comment.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex gap-3 py-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.user.image || "/placeholder.svg"} alt={comment.user.name} />
                <AvatarFallback className="text-xs font-semibold">{userInitials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{comment.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {getTimeAgo(new Date(comment.createdAt))}
                        </p>
                    </div>

                    {isOwner && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(comment.id)}
                            className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <p className="mt-1 text-sm text-foreground break-words">{comment.content}</p>
            </div>
        </div>
    );
}
