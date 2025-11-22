"use client"
import { useState, useTransition } from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
} from "@/components/ui/field";
import Image from "next/image";
import {authClient} from "@/lib/auth-client";
import {Loader2} from "lucide-react";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [_, startTransition] = useTransition();
    const [loadingProvider, setLoadingProvider] = useState<null | "github" | "google">(null);

    const googleSignIn = async () => {
        setLoadingProvider("google");
        startTransition(async () => {
            try {
                await authClient.signIn.social({ provider: "google" });
            } finally {
                setLoadingProvider(null);
            }
        });
    };

    const githubSignIn = async () => {
        setLoadingProvider("github");
        startTransition(async () => {
            try {
                await authClient.signIn.social({ provider: "github" });
            } finally {
                setLoadingProvider(null);
            }
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className={"rounded-md"}>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome to Prepify</CardTitle>
                    <CardDescription>
                        Login with your Github or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <Button
                                    disabled={loadingProvider !== null}
                                    onClick={githubSignIn}
                                    variant="outline"
                                    type="button"
                                >
                                    <Image src={"/icons/github.svg"} alt={"github icon"} width={28} height={28} />
                                    {loadingProvider === "github" ? <Loader2 className={"animate-spin"} /> : "Login with GitHub"}
                                </Button>
                                <Button
                                    disabled={loadingProvider !== null}
                                    onClick={googleSignIn}
                                    variant="outline"
                                    type="button"
                                >
                                    <Image src={"/icons/google.svg"} alt={"google icon"} width={24} height={24} />
                                    {loadingProvider === "google" ? <Loader2 className={"animate-spin"} /> : "Login with Google"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
