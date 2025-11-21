"use client"

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="main-container py-20">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="rounded-full bg-destructive/10 p-6">
                    <AlertCircle className="w-16 h-16 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold">Note Not Found</h1>
                    <p className="text-muted-foreground max-w-md">
                        The note you&#39;re looking for doesn&#39;t exist or has been removed.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/notes">Browse Notes</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

