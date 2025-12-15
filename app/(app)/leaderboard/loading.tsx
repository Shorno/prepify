import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
    return (
        <div className="main-container">
            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium">
                                    <Skeleton className="h-4 w-12" />
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium">
                                    <Skeleton className="h-4 w-20 ml-auto" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        <div className="flex gap-2 items-center">
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-6 w-6" />
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex flex-col items-end">
                                            <Skeleton className="h-5 w-16 mb-1" />
                                            <Skeleton className="h-3 w-8" />
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Skeleton className="h-6 w-12 ml-auto rounded-full" />
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Skeleton className="h-4 w-20 ml-auto" />
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
