import getPublicNotes from "@/actions/notes/get-public-notes";
import NoteCard from "@/components/note-card";

export default async function NotesList(){
    const notes = await getPublicNotes()
    if (!notes.success) {
        throw new Error(notes.error);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.data.map((note) => (
                <NoteCard key={note.id} data={note} />
            ))}
        </div>
    )
}