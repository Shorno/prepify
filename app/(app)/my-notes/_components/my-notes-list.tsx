"use client";

import { useQuery } from "@tanstack/react-query";
import getUserNotes from "@/actions/notes/get-user-notes";
import { UserNoteCard } from "@/components/user-note-card";

export default function MyNotesList() {
    const { data: result } = useQuery({
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
            <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
                <p className="text-muted-foreground">Create your first note and start sharing knowledge!</p>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {result.map((note) => (
                <UserNoteCard key={note.id} data={note} />
            ))}
        </div>
    );
}
