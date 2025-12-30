import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function UserProfileLoading() {
    return (
        <div className="main-container py-8">
            {/* Profile Header Skeleton */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />

                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                        <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
                    </div>

                    <Skeleton className="h-6 w-20 mx-auto md:mx-0" />

                    <div className="flex items-center justify-center md:justify-start gap-6">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-24" />
                    </div>

                    <Skeleton className="h-10 w-28 mx-auto md:mx-0" />
                </div>
            </div>

            {/* Notes Section Skeleton */}
            <div>
                <Skeleton className="h-7 w-20 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                            <Skeleton className="h-5 w-full mb-1" />
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <div className="flex gap-1">
                                <Skeleton className="w-16 h-16" />
                                <Skeleton className="w-16 h-16" />
                                <Skeleton className="w-16 h-16" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
