import { Skeleton } from "@/components/ui/skeleton";

export default function EditNoteLoading() {
    return (
        <div className="main-container my-20">
            {/* Header Section Skeleton */}
            <div className="mb-8 text-center">
                <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-2xl" />
                <Skeleton className="h-8 w-36 mx-auto mb-2 rounded-lg" />
                <Skeleton className="h-4 w-72 mx-auto rounded-lg" />
            </div>

            {/* Form Card Skeleton */}
            <div className="w-full max-w-2xl rounded-2xl mx-auto shadow-warm-lg border border-border/60 bg-card p-6 sm:p-8 space-y-6">
                {/* Department and Course fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-4 w-32 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20 rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-4 w-40 rounded-lg" />
                    </div>
                </div>

                {/* Title field */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-12 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>

                {/* Files field */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-12 rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-4 w-64 rounded-lg" />
                </div>

                {/* Resources field */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-5 w-32 mb-1 rounded-lg" />
                            <Skeleton className="h-4 w-48 rounded-lg" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-2">
                                <Skeleton className="h-10 flex-1 rounded-lg" />
                                <Skeleton className="h-10 w-10 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                    <Skeleton className="h-11 flex-1 rounded-full" />
                    <Skeleton className="h-11 flex-1 rounded-full" />
                </div>
            </div>
        </div>
    );
}
