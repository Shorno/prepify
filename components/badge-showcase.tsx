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
    if (all.length === 0) {
        return (
            <div className="space-y-3">
                <h3 className="text-lg font-bold">Badges</h3>
                <p className="text-sm text-muted-foreground">
                    Badges will appear here as you engage with the community — upload notes, maintain streaks, and more! 🏅
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Badges</h3>
                <span className="text-xs text-muted-foreground">
                    {earned.length} / {all.length}
                </span>
            </div>

            <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                    {all.map((b) => {
                        const isEarned = earnedBadgeIds.has(b.id);
                        const earnedData = earned.find((ub) => ub.badgeId === b.id);

                        return (
                            <Tooltip key={b.id}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-default",
                                            isEarned
                                                ? "bg-card border-primary/20 shadow-warm-sm hover:shadow-warm text-foreground"
                                                : "bg-muted/20 border-border/30 opacity-40 grayscale text-muted-foreground"
                                        )}
                                    >
                                        <span className="text-sm">{b.icon}</span>
                                        <span>{b.name}</span>
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
    );
}
