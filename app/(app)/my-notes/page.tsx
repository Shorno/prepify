import { checkAuth } from "@/app/actions/user/checkAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MyNotesList from "@/app/(app)/my-notes/_components/my-notes-list";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import getUserNotes from "@/actions/notes/get-user-notes";

export default async function MyNotesPage() {
    const user = await checkAuth();

    if (!user) {
        return redirect("/login?redirect=my-notes");
    }

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['user-notes'],
        queryFn: async () => {
            const result = await getUserNotes();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="main-container my-20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">My Notes</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage and view all your uploaded notes</p>
                    </div>
                    <Button asChild className="rounded-full px-6 shadow-warm hover:shadow-warm-lg">
                        <Link href="/my-notes/new">New Note</Link>
                    </Button>
                </div>
                <MyNotesList />
            </div>
        </HydrationBoundary>
    );
}
