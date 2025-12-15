import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function NoteDetailSkeleton() {
    return (
        <div className="main-container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Note Header */}
                    <div className="space-y-4">
                        {/* Uploader Info */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Course and Department Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-32" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-9 w-3/4" />

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-28" />
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-border" />

                    {/* Files Gallery */}
                    <div>
                        <Skeleton className="h-6 w-16 mb-4" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="aspect-[4/3] rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Reference Links for Mobile */}
                    <div className="lg:hidden">
                        <hr className="border-border mb-6" />
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="p-3">
                                    <Skeleton className="h-4 w-full" />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Reference Links (Desktop only) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-20 space-y-4">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="p-3">
                                    <Skeleton className="h-4 w-full" />
                                </Card>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
