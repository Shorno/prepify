import getPublicNotes from "@/actions/notes/get-public-notes";
import NotesPageClient from "@/components/notes-page-client";

export default async function NotesList(){
    const notes = await getPublicNotes()
    if (!notes.success) {
        throw new Error(notes.error);
    }

    return <NotesPageClient notes={notes.data} />;
}
