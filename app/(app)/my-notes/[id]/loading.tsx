import { Skeleton } from "@/components/ui/skeleton";

export default function MyNoteDetailSkeleton() {
    return (
        <div className="main-container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Note Header */}
                    <div className="space-y-4">
                        {/* Top row - stacks on mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-24 rounded-lg" />
                                    <Skeleton className="h-3 w-12 rounded-lg" />
                                </div>
                                {/* Date - desktop only */}
                                <Skeleton className="h-4 w-32 rounded-lg ml-2 hidden sm:block" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-16 rounded-lg" />
                                <Skeleton className="h-9 w-20 rounded-lg" />
                            </div>
                        </div>

                        {/* Date - mobile only */}
                        <Skeleton className="h-4 w-32 rounded-lg sm:hidden" />

                        {/* Course and Department Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Skeleton className="h-6 w-32 sm:w-72 rounded-full" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                            <Skeleton className="h-6 w-48 sm:w-80 rounded-full" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-9 w-40 rounded-lg" />

                        {/* Stats - simple inline text */}
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-5 w-14 rounded-lg" />
                            <Skeleton className="h-5 w-24 rounded-lg" />
                        </div>

                        {/* Engagement - simple pills */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-7 w-10 rounded-full" />
                            <Skeleton className="h-7 w-14 rounded-full" />
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-border/40" />

                    {/* Files Section */}
                    <div>
                        <Skeleton className="h-7 w-12 mb-4 rounded-lg" />
                        {/* Image grid - matching actual gallery layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-border/40" />

                    {/* Comments Section Skeleton */}
                    <div>
                        <Skeleton className="h-7 w-28 mb-4 rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-xl mb-4" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32 rounded-lg" />
                                        <Skeleton className="h-14 w-full rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reference Links for Mobile */}
                    <div className="lg:hidden">
                        <hr className="border-border/40 mb-6" />
                        <Skeleton className="h-7 w-36 mb-4 rounded-lg" />
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
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
                            {[1, 2].map((i) => (
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
