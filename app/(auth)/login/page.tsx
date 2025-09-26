"use client"
import {authClient} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";

export default function LoginPage() {
    const {data} = authClient.useSession()
    console.log(data)

    const githubSignIn = async () => {
        const data = await authClient.signIn.social({
            provider: "github"
        })
        console.log(data)
    }
    return (
        <>
            login page

            <Button onClick={() => githubSignIn()}>
                Login with Github
            </Button>


        </>
    )
}