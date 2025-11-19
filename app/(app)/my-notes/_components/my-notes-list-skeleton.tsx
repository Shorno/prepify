// components/my-notes/my-notes-list-skeleton.tsx
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function MyNotesListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded" />
                            <div className="h-4 bg-muted rounded w-2/3" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
