"use client"

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import deleteNote from "@/actions/notes/delete-note";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface NoteActionsProps {
    noteId: number;
}

export default function NoteActions({ noteId }: NoteActionsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEdit = () => {
        router.push(`/my-notes/${noteId}/edit`);
    };

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteNote(noteId);

                if (result.success) {
                    toast.success(result.message || "Note deleted successfully!");
                    router.push("/my-notes");
                } else {
                    toast.error(result.error);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsDialogOpen(false);
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isPending}
            >
                <Edit className="w-4 h-4 mr-2" />
                Edit
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your note
                            and all associated files and resources.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
