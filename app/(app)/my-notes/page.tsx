import {checkAuth} from "@/app/actions/user/checkAuth";
import {unauthorized} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default async function MyNotesPage() {
    const user = await checkAuth()
    if (!user) {
        unauthorized()
    }

    return (
        <>
            <div className={"main-container flex justify-between items-center"}>
                <h1 className={"text-2xl font-semibold"}>All</h1>
                <Button asChild>
                    <Link href={"/my-notes/new"}>New Note</Link>
                </Button>
            </div>
        </>
    )
}