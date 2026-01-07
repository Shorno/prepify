import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingNotesSkeleton() {
    return (
        <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-64" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-5 w-16" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-16 w-16 rounded" />
                            <Skeleton className="h-16 w-16 rounded" />
                            <Skeleton className="h-16 w-16 rounded" />
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
