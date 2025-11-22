import {checkAuth} from "@/app/actions/user/checkAuth";
import {unauthorized} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Suspense} from "react";
import MyNotesListSkeleton from "@/app/(app)/my-notes/_components/my-notes-list-skeleton";
import MyNotesList from "@/app/(app)/my-notes/_components/my-notes-list";

export default async function MyNotesPage() {
    const user = await checkAuth();

    if (!user) {
        unauthorized();
    }

    return (
        <div className="main-container">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">My Notes</h1>
                <Button asChild>
                    <Link href="/my-notes/new">New Note</Link>
                </Button>
            </div>
            <MyNotesList/>
        </div>
    );
}
