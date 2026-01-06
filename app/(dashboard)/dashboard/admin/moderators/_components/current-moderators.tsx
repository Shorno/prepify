"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { removeModerator } from "@/actions/moderator/moderator-application-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, UserMinus } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Moderator {
    id: string;
    name: string;
    email: string;
    image: string | null;
    username: string | null;
    createdAt: Date;
}

interface CurrentModeratorsProps {
    moderators: Moderator[];
}

export function CurrentModerators({ moderators }: CurrentModeratorsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleRemove = async (userId: string) => {
        setProcessingId(userId);
        startTransition(async () => {
            const result = await removeModerator(userId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
            setProcessingId(null);
        });
    };

    if (moderators.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No moderators yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moderators.map((moderator) => (
                <Card key={moderator.id}>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={moderator.image || ""} alt={moderator.name} />
                                    <AvatarFallback>
                                        {moderator.name?.charAt(0)?.toUpperCase() || "M"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-medium truncate">{moderator.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{moderator.email}</p>
                                    {moderator.username && (
                                        <p className="text-xs text-muted-foreground">@{moderator.username}</p>
                                    )}
                                </div>
                            </div>
                            <Badge variant="outline" className="shrink-0">Moderator</Badge>
                        </div>

                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Joined: {new Date(moderator.createdAt).toLocaleDateString()}
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive"
                                        disabled={isPending && processingId === moderator.id}
                                    >
                                        {isPending && processingId === moderator.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <UserMinus className="h-4 w-4" />
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Moderator</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to remove {moderator.name} as a moderator?
                                            They will be demoted to a regular student.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleRemove(moderator.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Remove
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
