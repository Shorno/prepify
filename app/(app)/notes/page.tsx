import NotesList from "@/components/notes-list";
import { FileText } from "lucide-react";

export default async function NotesPage() {
    return (
        <div className={"main-container my-20"}>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-warm-lg">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Browse Notes</h1>
                        <p className="text-muted-foreground mt-1">Discover and explore study notes shared by the community</p>
                    </div>
                </div>
            </div>

            <NotesList />
        </div>
    )
}
