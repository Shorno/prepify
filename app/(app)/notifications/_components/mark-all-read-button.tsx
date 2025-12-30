"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import markAllNotificationsRead from "@/actions/notifications/mark-all-read";
import { useRouter } from "next/navigation";

export default function MarkAllReadButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = () => {
        startTransition(async () => {
            await markAllNotificationsRead();
            router.refresh();
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <Check className="h-4 w-4 mr-2" />
            )}
            Mark all as read
        </Button>
    );
}
