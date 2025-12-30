import { checkAuth } from "@/app/actions/user/checkAuth";
import { redirect } from "next/navigation";
import getNotifications from "@/actions/notifications/get-notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, FileText, UserPlus } from "lucide-react";
import Link from "next/link";
import MarkAllReadButton from "./_components/mark-all-read-button";

export default async function NotificationsPage() {
    const session = await checkAuth();

    if (!session?.user) {
        redirect("/login");
    }

    const result = await getNotifications(50, 0);
    const notifications = result.success ? result.data.notifications : [];
    const unreadCount = result.success ? result.data.unreadCount : 0;

    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "new_note":
                return <FileText className="h-5 w-5 text-blue-500" />;
            case "new_follower":
                return <UserPlus className="h-5 w-5 text-green-500" />;
            default:
                return <Bell className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getLink = (notification: typeof notifications[0]) => {
        if (notification.type === "new_note" && notification.noteId) {
            return `/notes/${notification.noteId}`;
        }
        if (notification.type === "new_follower" && notification.actorId) {
            return `/user/${notification.actorId}`;
        }
        return null;
    };

    return (
        <div className="main-container py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && <MarkAllReadButton />}
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No notifications yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Follow other users to get notified when they upload new notes
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => {
                            const link = getLink(notification);
                            const actorInitials = notification.actor?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "?";

                            const content = (
                                <Card
                                    key={notification.id}
                                    className={`p-4 transition-colors hover:bg-accent/50 ${!notification.isRead ? 'bg-accent/30 border-primary/20' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarImage src={notification.actor?.image || undefined} />
                                            <AvatarFallback className="text-sm">{actorInitials}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2">
                                                {getIcon(notification.type)}
                                                <p className="text-sm leading-relaxed">{notification.message}</p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                                {!notification.isRead && (
                                                    <Badge variant="default" className="text-xs h-5">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );

                            return link ? (
                                <Link key={notification.id} href={link}>
                                    {content}
                                </Link>
                            ) : (
                                <div key={notification.id}>{content}</div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
