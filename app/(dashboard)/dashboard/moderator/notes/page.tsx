import { Suspense } from "react";
import { getPendingNotes } from "@/actions/moderator/note-moderation-actions";
import { PendingNotesList } from "./_components/pending-notes-list";
import { PendingNotesSkeleton } from "./_components/skeletons";

async function PendingNotesWrapper() {
    const notes = await getPendingNotes();
    return <PendingNotesList notes={notes} />;
}

export default function ModeratorNotesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Notes Review</h1>
                <p className="text-muted-foreground">
                    Review and moderate pending notes submissions
                </p>
            </div>

            <Suspense fallback={<PendingNotesSkeleton />}>
                <PendingNotesWrapper />
            </Suspense>
        </div>
    );
}
