import {checkAuth} from "@/app/actions/user/checkAuth";
import {unauthorized} from "next/navigation";

export default async function MyNotesPage() {
    const user = await checkAuth()
    if (!user){
        unauthorized()
    }

    return (
        <>
            <div className={"flex justify-center items-center"}>
                <h1 className={"text-2xl font-semibold"}>Share your note with everyone</h1>

            </div>

        </>
    )
}