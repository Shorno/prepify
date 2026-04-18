import { checkAuth } from "@/app/actions/user/checkAuth";
import { redirect } from "next/navigation";
import BookmarksPageContent from "./_components/bookmarks-page-content";

export default async function BookmarksPage() {
    const user = await checkAuth();

    if (!user) {
        return redirect("/login?redirect=bookmarks");
    }

    return (
        <div className="main-container my-20">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">My Bookmarks</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Your saved notes and collections
                </p>
            </div>
            <BookmarksPageContent />
        </div>
    );
}
