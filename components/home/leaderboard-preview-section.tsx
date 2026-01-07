"use client";

import { LeaderboardEntry } from "@/db/schema/leaderboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Crown, Medal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

interface LeaderboardPreviewSectionProps {
    data: { success: boolean; data?: LeaderboardEntry[]; error?: string };
}

export default function LeaderboardPreviewSection({ data }: LeaderboardPreviewSectionProps) {
    if (!data.success || !data.data || data.data.length === 0) {
        return null;
    }

    const topUsers = data.data.slice(0, 5);

    return (
        <section className="py-20 md:py-32 w-full bg-background w-full">
            <div className="container px-4 md:px-6 mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-500 w-fit">
                                <Crown className="mr-1.5 h-3 w-3 fill-yellow-500/20" />
                                <span>Top Contributors</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-serif">
                                Hall of Fame
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                meet the brilliant minds sharing their knowledge and leading the community. Earn points by uploading notes and getting upvotes.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="/leaderboard">
                                    View Leaderboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Leaderboard Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-card border border-border rounded-xl shadow-lg overflow-hidden relative"
                    >
                        {/* Decorative gradient blur */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="p-6 md:p-8 space-y-6 relative z-10">
                            <h3 className="font-semibold text-lg text-muted-foreground uppercase tracking-widest text-xs mb-4">This Month's Top 5</h3>

                            <div className="space-y-4">
                                {topUsers.map((entry, index) => {
                                    const isTop3 = index < 3;
                                    let rankColor = "bg-muted text-muted-foreground";
                                    let icon = null;

                                    if (index === 0) {
                                        rankColor = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-700/50";
                                        icon = <Crown className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500 fill-current" />;
                                    } else if (index === 1) {
                                        rankColor = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
                                        icon = <Medal className="w-3.5 h-3.5 text-slate-500 fill-current" />;
                                    } else if (index === 2) {
                                        rankColor = "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-500 dark:border-orange-700/50";
                                        icon = <Medal className="w-3.5 h-3.5 text-orange-600 dark:text-orange-500 fill-current" />;
                                    }

                                    return (
                                        <div key={entry.id} className="flex items-center gap-4 group">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${rankColor}`}>
                                                {icon || index + 1}
                                            </div>

                                            <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border">
                                                <AvatarImage src={entry.user.image || undefined} alt={entry.user.name} />
                                                <AvatarFallback>{entry.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">{entry.user.name}</p>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span>{entry.notesCreated} Notes</span>
                                                </div>
                                            </div>

                                            <div className="font-mono font-bold text-foreground">
                                                {entry.totalPoints.toLocaleString()} <span className="text-xs text-muted-foreground font-sans font-normal">pts</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
