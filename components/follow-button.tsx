"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import followUser from "@/actions/follow/follow-user";
import unfollowUser from "@/actions/follow/unfollow-user";
import { toast } from "sonner";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing: boolean;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export default function FollowButton({
    userId,
    initialIsFollowing,
    variant = "default",
    size = "default",
    className,
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            if (isFollowing) {
                const result = await unfollowUser(userId);
                if (result.success) {
                    setIsFollowing(false);
                    toast.success("Unfollowed successfully");
                } else {
                    toast.error(result.error);
                }
            } else {
                const result = await followUser(userId);
                if (result.success) {
                    setIsFollowing(true);
                    toast.success(result.message);
                } else {
                    toast.error(result.error);
                }
            }
        });
    };

    return (
        <Button
            variant={isFollowing ? "outline" : variant}
            size={size}
            onClick={handleClick}
            disabled={isPending}
            className={className}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Following
                </>
            ) : (
                <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                </>
            )}
        </Button>
    );
}
