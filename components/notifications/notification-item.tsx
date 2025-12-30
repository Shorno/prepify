"use client";

import { NotificationWithRelations } from "@/db/schema/notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, FileText, UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Simple helper to format relative time
function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

interface NotificationItemProps {
    notification: NotificationWithRelations;
    onRead?: (id: number) => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case "new_note":
                return <FileText className="h-4 w-4 text-blue-500" />;
            case "new_follower":
                return <UserPlus className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getLink = () => {
        if (notification.type === "new_note" && notification.noteId) {
            return `/notes/${notification.noteId}`;
        }
        if (notification.type === "new_follower" && notification.actor) {
            return `/user/${notification.actorId}`;
        }
        return null;
    };

    const actorInitials = notification.actor?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?";

    const timeAgo = formatTimeAgo(new Date(notification.createdAt));

    const handleClick = () => {
        if (!notification.isRead && onRead) {
            onRead(notification.id);
        }
    };

    const content = (
        <div
            className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-accent",
                !notification.isRead && "bg-accent/50"
            )}
            onClick={handleClick}
        >
            <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={notification.actor?.image || undefined} />
                <AvatarFallback className="text-xs">{actorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start gap-2">
                    {getIcon()}
                    <p className="text-sm leading-snug">{notification.message}</p>
                </div>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
            {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
            )}
        </div>
    );

    const link = getLink();
    if (link) {
        return <Link href={link}>{content}</Link>;
    }

    return content;
}
