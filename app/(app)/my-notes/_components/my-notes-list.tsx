"use client";

import {useSuspenseQuery} from "@tanstack/react-query";
import getUserNotes from "@/actions/notes/get-user-notes";
import {UserNoteCard} from "@/components/user-note-card";

export default function MyNotesList() {
    const {data: result} = useSuspenseQuery({
        queryKey: ['user-notes'],
        queryFn: async () => {
            const result = await getUserNotes();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });

    if (!result || result.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No notes yet. Create your first note!</p>
            </div>
        );
    }

    console.log(result)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {result.map((note) => (
                <UserNoteCard key={note.id} data={note} />
            ))}
        </div>
    );
}
