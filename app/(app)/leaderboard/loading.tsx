import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
    return (
        <div className="main-container my-20">
            {/* Header Section Skeleton */}
            <div className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div>
                        <Skeleton className="h-8 w-40 rounded-lg mb-2" />
                        <Skeleton className="h-4 w-56 rounded-lg" />
                    </div>
                </div>

                {/* Stats Summary Skeleton */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <Skeleton className="h-9 w-36 rounded-full" />
                    <Skeleton className="h-9 w-44 rounded-full" />
                </div>
            </div>

            {/* Top 3 Podium Skeleton (Desktop) */}
            <div className="hidden lg:grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                {/* Second Place */}
                <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl border border-border/40 mt-8">
                    <Skeleton className="w-12 h-12 rounded-full mb-3" />
                    <Skeleton className="w-16 h-16 rounded-full mb-2" />
                    <Skeleton className="h-4 w-24 rounded-lg mb-1" />
                    <Skeleton className="h-5 w-16 rounded-lg" />
                </div>

                {/* First Place */}
                <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl border border-border/40">
                    <Skeleton className="w-8 h-8 rounded-full mb-2" />
                    <Skeleton className="w-14 h-14 rounded-full mb-3" />
                    <Skeleton className="w-20 h-20 rounded-full mb-2" />
                    <Skeleton className="h-5 w-28 rounded-lg mb-1" />
                    <Skeleton className="h-6 w-20 rounded-lg" />
                </div>

                {/* Third Place */}
                <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl border border-border/40 mt-8">
                    <Skeleton className="w-12 h-12 rounded-full mb-3" />
                    <Skeleton className="w-16 h-16 rounded-full mb-2" />
                    <Skeleton className="h-4 w-24 rounded-lg mb-1" />
                    <Skeleton className="h-5 w-16 rounded-lg" />
                </div>
            </div>

            {/* Mobile Card Layout Skeleton */}
            <div className="md:hidden space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 rounded-2xl border border-border/60 bg-card">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-32 rounded-lg mb-2" />
                                <Skeleton className="h-5 w-20 rounded-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
                            <Skeleton className="h-4 w-20 rounded-lg" />
                            <Skeleton className="h-4 w-16 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table Skeleton */}
            <div className="hidden md:block rounded-2xl border border-border/60 overflow-hidden shadow-warm-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/30">
                            <tr className="border-b border-border/40">
                                <th className="h-14 px-4 text-left align-middle font-medium">
                                    <Skeleton className="h-4 w-12 rounded-lg" />
                                </th>
                                <th className="h-14 px-4 text-left align-middle font-medium">
                                    <Skeleton className="h-4 w-16 rounded-lg" />
                                </th>
                                <th className="h-14 px-4 text-right align-middle font-medium">
                                    <Skeleton className="h-4 w-16 ml-auto rounded-lg" />
                                </th>
                                <th className="h-14 px-4 text-right align-middle font-medium">
                                    <Skeleton className="h-4 w-16 ml-auto rounded-lg" />
                                </th>
                                <th className="h-14 px-4 text-right align-middle font-medium">
                                    <Skeleton className="h-4 w-20 ml-auto rounded-lg" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <tr key={i} className="border-b border-border/40">
                                    <td className="p-4 align-middle">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <Skeleton className="h-4 w-32 rounded-lg" />
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <Skeleton className="h-5 w-16 rounded-lg" />
                                            <Skeleton className="h-3 w-8 rounded-lg" />
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Skeleton className="h-6 w-12 ml-auto rounded-full" />
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Skeleton className="h-4 w-16 ml-auto rounded-lg" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
