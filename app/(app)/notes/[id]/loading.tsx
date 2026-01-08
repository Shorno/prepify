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
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-36 rounded-lg" />
                                <Skeleton className="h-4 w-24 rounded-lg" />
                            </div>
                            <Skeleton className="h-8 w-28 rounded-full" />
                        </div>

                        {/* Course and Department Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Skeleton className="h-7 w-28 rounded-full" />
                            <Skeleton className="h-7 w-20 rounded-full" />
                            <Skeleton className="h-7 w-36 rounded-full" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-10 w-3/4 rounded-lg" />

                        {/* Stats */}
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-24 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-full" />
                        </div>

                        {/* Engagement */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-20 rounded-full" />
                            <Skeleton className="h-10 w-20 rounded-full" />
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-border/40" />

                    {/* Files Gallery */}
                    <div>
                        <Skeleton className="h-7 w-24 mb-4 rounded-lg" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Reference Links for Mobile */}
                    <div className="lg:hidden">
                        <hr className="border-border/40 mb-6" />
                        <Skeleton className="h-7 w-36 mb-4 rounded-lg" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border border-border/60 rounded-xl p-4">
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Reference Links (Desktop only) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-20 space-y-4">
                        <Skeleton className="h-7 w-36 mb-4 rounded-lg" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border border-border/60 rounded-xl p-4">
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
