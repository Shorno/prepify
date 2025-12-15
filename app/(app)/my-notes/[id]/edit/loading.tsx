import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditNoteLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <Skeleton className="h-9 w-32 mb-2" />
                <Skeleton className="h-5 w-64" />
            </div>

            <Card className="w-full rounded-md shadow-md border-0">
                <CardContent className="space-y-6">
                    {/* Department and Course fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>

                    {/* Title field */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Files field */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-32 w-full rounded-md" />
                        <Skeleton className="h-4 w-64" />
                    </div>

                    {/* Resources field */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-2">
                                    <Skeleton className="h-10 flex-1" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                        <Skeleton className="h-11 flex-1" />
                        <Skeleton className="h-11 flex-1" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
