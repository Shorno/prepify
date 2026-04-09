"use client"

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
    variant?: "compact" | "full";
}

export default function StreakDisplay({
    currentStreak,
    longestStreak,
    variant = "compact",
}: StreakDisplayProps) {
    if (currentStreak === 0 && variant === "compact") {
        return null;
    }

    const getStreakColor = (streak: number) => {
        if (streak >= 30) return "text-orange-500";
        if (streak >= 14) return "text-amber-500";
        if (streak >= 7) return "text-yellow-500";
        if (streak >= 3) return "text-yellow-400";
        return "text-muted-foreground";
    };

    const getStreakBg = (streak: number) => {
        if (streak >= 30) return "bg-orange-500/10 border-orange-500/20";
        if (streak >= 14) return "bg-amber-500/10 border-amber-500/20";
        if (streak >= 7) return "bg-yellow-500/10 border-yellow-500/20";
        if (streak >= 3) return "bg-yellow-400/10 border-yellow-400/20";
        return "bg-muted/50 border-border";
    };

    if (variant === "compact") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                            getStreakBg(currentStreak),
                            getStreakColor(currentStreak)
                        )}>
                            <Flame className={cn(
                                "w-3 h-3",
                                currentStreak >= 7 && "animate-pulse"
                            )} />
                            <span>{currentStreak}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{currentStreak}-day streak! Best: {longestStreak} days</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Full variant — for profile pages
    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border",
            getStreakBg(currentStreak)
        )}>
            <div className={cn(
                "flex items-center justify-center w-14 h-14 rounded-xl",
                currentStreak > 0 ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-muted"
            )}>
                <Flame className={cn(
                    "w-7 h-7",
                    currentStreak > 0 ? "text-white" : "text-muted-foreground",
                    currentStreak >= 7 && "animate-pulse"
                )} />
            </div>
            <div className="flex-1">
                <div className="flex items-baseline gap-2">
                    <span className={cn("text-2xl font-bold", getStreakColor(currentStreak))}>
                        {currentStreak}
                    </span>
                    <span className="text-sm text-muted-foreground">day streak</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Best streak: <span className="font-semibold text-foreground">{longestStreak} days</span>
                </p>
            </div>
        </div>
    );
}
