import NewNoteForm from "@/app/(app)/my-notes/new/_components/new-note-form";
import { PenLine, Sparkles, Camera } from "lucide-react";

export default function NewNotesPage() {
    return (
        <div className="main-container my-12 sm:my-20">
            {/* Header Section */}
            <div className="mb-10 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-warm-lg">
                    <PenLine className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Share Your Notes</h1>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Help your peers learn — upload your handwritten notes and earn points on the leaderboard
                </p>

                {/* Tips bar */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-primary" />
                        <span>Clear photos get more views</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>AI explanations available after approval</span>
                    </div>
                </div>
            </div>
            <NewNoteForm />
        </div>
    )
}