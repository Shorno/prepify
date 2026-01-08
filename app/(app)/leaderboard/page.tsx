import { getPublicLeaderboard } from "@/actions/leaderboard/get-leader-board";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { Trophy, Star, Award } from "lucide-react";

export default async function LeaderboardPage() {
    const result = await getPublicLeaderboard()

    if (!result.success) {
        return (
            <div className="main-container my-20">
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Error loading leaderboard</h3>
                    <p className="text-muted-foreground">{result.error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="main-container my-20">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-warm-lg">
                        <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
                        <p className="text-muted-foreground mt-1">Top contributors in our community</p>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        {result.data.length} Contributors
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <Award className="w-4 h-4" />
                        {result.data.reduce((sum, entry) => sum + entry.totalPoints, 0).toLocaleString()} Total Points
                    </div>
                </div>
            </div>

            {/* Top 3 Podium (for desktop) */}
            {result.data.length >= 3 && (
                <div className="hidden lg:grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                    {/* Second Place */}
                    <div className="order-1 flex flex-col items-center p-6 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-warm-sm mt-8">
                        <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center mb-3 ring-4 ring-slate-200 dark:ring-slate-700">
                            <span className="text-xl font-bold text-slate-600 dark:text-slate-300">2</span>
                        </div>
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-slate-300 dark:ring-slate-600">
                            <img
                                src={result.data[1].user.image || "/placeholder.svg"}
                                alt={result.data[1].user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="font-semibold text-sm text-center truncate w-full">{result.data[1].user.name}</p>
                        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{result.data[1].totalPoints} pts</p>
                    </div>

                    {/* First Place */}
                    <div className="order-2 flex flex-col items-center p-6 bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-warm-lg relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <Trophy className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3 ring-4 ring-amber-200 dark:ring-amber-700 mt-4">
                            <span className="text-2xl font-bold text-white">1</span>
                        </div>
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-2 ring-4 ring-amber-300 dark:ring-amber-600">
                            <img
                                src={result.data[0].user.image || "/placeholder.svg"}
                                alt={result.data[0].user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="font-bold text-center truncate w-full">{result.data[0].user.name}</p>
                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{result.data[0].totalPoints} pts</p>
                    </div>

                    {/* Third Place */}
                    <div className="order-3 flex flex-col items-center p-6 bg-gradient-to-b from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-warm-sm mt-8">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-3 ring-4 ring-orange-200 dark:ring-orange-700">
                            <span className="text-xl font-bold text-white">3</span>
                        </div>
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-orange-300 dark:ring-orange-600">
                            <img
                                src={result.data[2].user.image || "/placeholder.svg"}
                                alt={result.data[2].user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="font-semibold text-sm text-center truncate w-full">{result.data[2].user.name}</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{result.data[2].totalPoints} pts</p>
                    </div>
                </div>
            )}

            {/* Full Table */}
            <div className="rounded-2xl border border-border/60 overflow-hidden shadow-warm-sm">
                <LeaderboardTable data={result.data} />
            </div>
        </div>
    )
}