"use client"

import { cn } from "@/lib/utils";
import { Badge as BadgeType, UserBadgeWithBadge } from "@/db/schema/streak";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeShowcaseProps {
    earned: UserBadgeWithBadge[];
    all: BadgeType[];
    compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
    upload: "Uploads",
    streak: "Streaks",
    engagement: "Engagement",
    social: "Social",
};

export default function BadgeShowcase({ earned, all, compact = false }: BadgeShowcaseProps) {
    const earnedBadgeIds = new Set(earned.map((ub) => ub.badgeId));

    // Group badges by category
    const grouped = all.reduce<Record<string, BadgeType[]>>((acc, b) => {
        if (!acc[b.category]) acc[b.category] = [];
        acc[b.category].push(b);
        return acc;
    }, {});

    if (compact) {
        // Compact: show only earned badges in a single row
        if (earned.length === 0) return null;

        return (
            <TooltipProvider>
                <div className="flex items-center gap-1 flex-wrap">
                    {earned.slice(0, 5).map((ub) => (
                        <Tooltip key={ub.badgeId}>
                            <TooltipTrigger asChild>
                                <span className="text-base cursor-default hover:scale-125 transition-transform">
                                    {ub.badge.icon}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-semibold">{ub.badge.name}</p>
                                <p className="text-xs text-muted-foreground">{ub.badge.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    {earned.length > 5 && (
                        <span className="text-xs text-muted-foreground font-medium">
                            +{earned.length - 5}
                        </span>
                    )}
                </div>
            </TooltipProvider>
        );
    }

    // Full showcase: grouped by category with progress
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Badges</h3>
                <span className="text-sm text-muted-foreground">
                    {earned.length} / {all.length} earned
                </span>
            </div>

            {Object.entries(grouped).map(([category, badges]) => (
                <div key={category}>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                        {CATEGORY_LABELS[category] || category}
                    </h4>
                    <TooltipProvider>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {badges.map((b) => {
                                const isEarned = earnedBadgeIds.has(b.id);
                                const earnedData = earned.find((ub) => ub.badgeId === b.id);

                                return (
                                    <Tooltip key={b.id}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={cn(
                                                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-default",
                                                    isEarned
                                                        ? "bg-card border-primary/20 shadow-warm-sm hover:shadow-warm"
                                                        : "bg-muted/30 border-border/40 opacity-40 grayscale"
                                                )}
                                            >
                                                <span className={cn(
                                                    "text-2xl",
                                                    isEarned && "animate-in zoom-in"
                                                )}>
                                                    {b.icon}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] font-semibold text-center leading-tight",
                                                    isEarned ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {b.name}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[200px]">
                                            <p className="font-semibold">{b.name}</p>
                                            <p className="text-xs text-muted-foreground">{b.description}</p>
                                            {isEarned && earnedData && (
                                                <p className="text-xs text-primary mt-1">
                                                    Earned {new Date(earnedData.earnedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                            {!isEarned && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    Not yet earned
                                                </p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                </div>
            ))}
        </div>
    );
}
