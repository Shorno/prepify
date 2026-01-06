"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Loader2 } from "lucide-react";
import NotificationItem from "./notification-item";
import getNotifications from "@/actions/notifications/get-notifications";
import markNotificationRead from "@/actions/notifications/mark-notification-read";
import markAllNotificationsRead from "@/actions/notifications/mark-all-read";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const result = await getNotifications(10, 0);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const handleMarkRead = (notificationId: number) => {
        startTransition(async () => {
            await markNotificationRead(notificationId);
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });
    };

    const handleMarkAllRead = () => {
        startTransition(async () => {
            await markAllNotificationsRead();
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });
    };

    const unreadCount = data?.unreadCount ?? 0;
    const notifications = data?.notifications ?? [];

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            disabled={isPending}
                            className="text-xs h-7"
                        >
                            {isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark all read
                                </>
                            )}
                        </Button>
                    )}
                </div>
                <ScrollArea className="max-h-80">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onRead={handleMarkRead}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="border-t p-2">
                        <Link
                            href="/notifications"
                            className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                            onClick={() => setIsOpen(false)}
                        >
                            View all notifications
                        </Link>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
