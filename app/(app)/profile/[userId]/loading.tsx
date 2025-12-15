import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header Skeleton */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar Skeleton */}
                        <Skeleton className="h-24 w-24 rounded-full" />

                        {/* User Info Skeleton */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <Skeleton className="h-9 w-48 mb-2" />
                                <Skeleton className="h-5 w-24" />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-28" />
                            </div>
                        </div>

                        {/* Rank Badge Skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-8 w-12" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-3">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-9 w-20 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Notes Section Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-16" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="p-3">
                            {/* Uploader info skeleton */}
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>

                            {/* Badges skeleton */}
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-12" />
                            </div>

                            {/* Title skeleton */}
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-3" />

                            {/* Image preview skeleton */}
                            <div className="flex gap-2 mb-3">
                                <Skeleton className="w-20 h-20 rounded" />
                                <Skeleton className="w-20 h-20 rounded" />
                                <Skeleton className="w-20 h-20 rounded" />
                            </div>

                            {/* Stats skeleton */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
