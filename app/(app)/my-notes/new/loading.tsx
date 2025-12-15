import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewNoteLoading() {
    return (
        <div className="main-container flex flex-col">
            <Card className="w-full max-w-2xl rounded-md mx-auto shadow-md border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
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

                    {/* Submit button */}
                    <div className="pt-4">
                        <Skeleton className="h-11 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
