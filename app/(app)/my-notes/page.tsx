import {checkAuth} from "@/app/actions/user/checkAuth";
import {unauthorized} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import MyNotesList from "@/app/(app)/my-notes/_components/my-notes-list";
import {HydrationBoundary, QueryClient, dehydrate} from "@tanstack/react-query";
import getUserNotes from "@/actions/notes/get-user-notes";

export default async function MyNotesPage() {
    const user = await checkAuth();

    if (!user) {
        unauthorized();
    }

    // Prefetch data on the server
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
            <div className="main-container">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">My Notes</h1>
                    <Button asChild>
                        <Link href="/my-notes/new">New Note</Link>
                    </Button>
                </div>
                <MyNotesList/>
            </div>
        </HydrationBoundary>
    );
}
