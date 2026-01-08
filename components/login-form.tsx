"use client"
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

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
            <Card className={"rounded-2xl shadow-warm-lg border-border/50 overflow-hidden"}>
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">👋</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome to Prepify</CardTitle>
                    <CardDescription className="text-base">
                        Login with your Github or Google account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <form>
                        <FieldGroup>
                            <Field className="space-y-3">
                                <Button
                                    disabled={loadingProvider !== null}
                                    onClick={githubSignIn}
                                    variant="outline"
                                    type="button"
                                    className="h-12 rounded-xl text-base font-medium hover:bg-muted/80 hover:border-primary/30 transition-all duration-200"
                                >
                                    <Image src={"/icons/github.svg"} alt={"github icon"} width={24} height={24} />
                                    {loadingProvider === "github" ? <Loader2 className={"animate-spin"} /> : "Continue with GitHub"}
                                </Button>
                                <Button
                                    disabled={loadingProvider !== null}
                                    onClick={googleSignIn}
                                    variant="outline"
                                    type="button"
                                    className="h-12 rounded-xl text-base font-medium hover:bg-muted/80 hover:border-primary/30 transition-all duration-200"
                                >
                                    <Image src={"/icons/google.svg"} alt={"google icon"} width={20} height={20} />
                                    {loadingProvider === "google" ? <Loader2 className={"animate-spin"} /> : "Continue with Google"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
}
