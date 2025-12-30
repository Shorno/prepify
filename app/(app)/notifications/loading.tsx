import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function NotificationsLoading() {
    return (
        <div className="main-container py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                </div>

                {/* Notifications List */}
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
