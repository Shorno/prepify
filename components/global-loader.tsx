export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <h1 className="text-2xl font-bold tracking-wide">Prepify</h1>
            <p className="text-sm text-muted-foreground animate-pulse mt-2">
                Loading...
            </p>
        </div>
    )
}