// components/my-notes/my-notes-list-skeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MyNotesListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse rounded-2xl shadow-warm-sm">
                    <CardHeader>
                        <div className="h-6 bg-muted/60 rounded-lg w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="h-4 bg-muted/60 rounded-lg" />
                            <div className="h-4 bg-muted/60 rounded-lg w-2/3" />
                            <div className="h-4 bg-muted/60 rounded-lg w-1/2" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
