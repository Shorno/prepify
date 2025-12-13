import { FileX } from "lucide-react";

export default function MyNoteNotFound() {
    return (
        <div className="main-container py-16">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <FileX className="w-16 h-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold text-foreground">Note Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    The note you're looking for doesn't exist or you don't have permission to view it.
                </p>
            </div>
        </div>
    );
}
