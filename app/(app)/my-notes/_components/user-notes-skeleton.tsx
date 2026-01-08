export function UserNoteCardSkeleton() {
    return (
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-warm-sm h-full flex flex-col animate-pulse">
            {/* Course and department badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="h-6 w-20 bg-primary/10 rounded-full" />
                <div className="h-6 w-12 bg-muted/60 rounded-full" />
            </div>

            {/* Title */}
            <div className="h-5 w-2/3 bg-muted/60 mb-4 rounded-lg" />

            {/* Image preview flex with fixed sized skeleton blocks */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted/60 rounded-xl" />
                ))}
            </div>

            {/* Stats and button row */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border/40">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-10 bg-muted/60 rounded-lg" />
                    <div className="h-4 w-10 bg-muted/60 rounded-lg" />
                </div>
                <div className="h-7 w-16 bg-muted/60 rounded-full" />
            </div>
        </div>
    );
}
