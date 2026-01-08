import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
    return (
        <div className="main-container">
            <div className="rounded-2xl border border-border/60 overflow-hidden shadow-warm-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/30">
                            <tr className="border-b border-border/40 transition-colors">
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
                                <tr key={i} className="border-b border-border/40 transition-colors hover:bg-muted/30">
                                    <td className="p-4 align-middle">
                                        <div className="flex gap-2 items-center">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-lg" />
                                        </div>
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
                                            <Skeleton className="h-3 w-10 rounded-lg" />
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Skeleton className="h-6 w-14 ml-auto rounded-full" />
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Skeleton className="h-4 w-20 ml-auto rounded-lg" />
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
