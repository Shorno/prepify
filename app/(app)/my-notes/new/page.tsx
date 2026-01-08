import NewNoteForm from "@/app/(app)/my-notes/new/_components/new-note-form";
import { PenLine } from "lucide-react";

export default function NewNotesPage() {
    return (
        <div className="main-container my-20">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-warm-lg">
                    <PenLine className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Create New Note</h1>
                <p className="text-muted-foreground mt-2">Share your knowledge with the community</p>
            </div>
            <NewNoteForm />
        </div>
    )
}