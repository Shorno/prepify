import getNoteById from "@/actions/notes/get-note-by-id";
import { notFound, redirect } from "next/navigation";
import { checkAuth } from "@/app/actions/user/checkAuth";
import EditNoteForm from "@/app/(app)/my-notes/[id]/edit/_components/edit-note-form";
import { Edit3 } from "lucide-react";

interface EditNotePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: EditNotePageProps) {
    const session = await checkAuth();

    if (!session?.user) {
        redirect("/login");
    }

    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
        notFound();
    }

    const result = await getNoteById(noteId);

    if (!result.success) {
        notFound();
    }

    const note = result.data;

    // Check if the current user is the owner of this note
    if (note.userId !== session.user.id) {
        redirect(`/notes/${noteId}`);
    }

    return (
        <div className="main-container my-20">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-warm-lg">
                    <Edit3 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Edit Note</h1>
                <p className="text-muted-foreground mt-2">Update your note details, files, and resources</p>
            </div>

            <EditNoteForm note={note} />
        </div>
    );
}
