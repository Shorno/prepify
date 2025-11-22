export function UserNoteCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-sm p-3 shadow-sm h-full flex flex-col animate-pulse">
            {/* Course and department badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="h-5 w-20 bg-primary/10 rounded" />
                <div className="h-5 w-10 bg-muted rounded" />
            </div>

            {/* Title */}
            <div className="h-5 w-2/3 bg-muted mb-3 rounded" />

            {/* Image preview flex with fixed sized skeleton blocks */}
            <div className="flex gap-2 mb-3 flex-wrap">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded border border-border" />
                ))}
            </div>

            {/* Stats and button row */}
            <div className="flex items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-3 text-xs">
                    <div className="h-4 w-8 bg-muted rounded" />
                    <div className="h-4 w-8 bg-muted rounded" />
                </div>
                <div className="h-5 w-12 bg-muted rounded" />
            </div>
        </div>
    );
}
