"use client"
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";

export default function SignOutButton() {
    const signOut = async () => {
        await authClient.signOut();
    }

    return (
        <>
            <Button size={"sm"} onClick={() => signOut()} variant={"destructive"}>
                Logout
            </Button>
        </>
    )
}