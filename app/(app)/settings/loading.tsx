import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
    return (
        <div className="main-container my-20">
            {/* Header Section Skeleton */}
            <div className="mb-8 text-center">
                <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-2xl" />
                <Skeleton className="h-8 w-32 mx-auto mb-2 rounded-lg" />
                <Skeleton className="h-4 w-56 mx-auto rounded-lg" />
            </div>

            <div className="w-full max-w-2xl mx-auto space-y-6">
                {/* Account Section */}
                <div className="rounded-2xl shadow-warm-lg border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-5 w-20 mb-1 rounded-lg" />
                            <Skeleton className="h-4 w-36 rounded-lg" />
                        </div>
                    </div>

                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4 mb-6">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div>
                            <Skeleton className="h-5 w-32 mb-2 rounded-lg" />
                            <Skeleton className="h-4 w-48 rounded-lg" />
                        </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-3 w-64 rounded-lg" />
                    </div>
                </div>

                {/* Academic Section */}
                <div className="rounded-2xl shadow-warm-lg border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-5 w-40 mb-1 rounded-lg" />
                            <Skeleton className="h-4 w-48 rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Department Field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>

                        {/* Batch Field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16 rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="rounded-2xl shadow-warm-lg border border-border/60 bg-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-5 w-28 mb-1 rounded-lg" />
                            <Skeleton className="h-4 w-44 rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16 rounded-lg" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <Skeleton className="h-11 w-full rounded-full" />
                </div>
            </div>
        </div>
    );
}
