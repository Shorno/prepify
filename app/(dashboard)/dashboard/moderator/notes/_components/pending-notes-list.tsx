"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { approveNote, rejectNote } from "@/actions/moderator/note-moderation-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, FileText, ExternalLink, User, Calendar, Building2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Note, Resource, File as FileType, User as UserType, Course, Department, Faculty } from "@/db/schema";

type PendingNote = Note & {
    user: UserType;
    course: Course;
    department: Department;
    faculty: Faculty;
    resources: Resource[];
    files: FileType[];
};

interface PendingNotesListProps {
    notes: PendingNote[];
}

export function PendingNotesList({ notes }: PendingNotesListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<PendingNote | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleApprove = async (noteId: number) => {
        setProcessingId(noteId);
        startTransition(async () => {
            const result = await approveNote(noteId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
            setProcessingId(null);
        });
    };

    const openRejectDialog = (note: PendingNote) => {
        setSelectedNote(note);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    const handleReject = async () => {
        if (!selectedNote) return;

        setProcessingId(selectedNote.id);
        startTransition(async () => {
            const result = await rejectNote(selectedNote.id, rejectionReason || undefined);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
            setProcessingId(null);
            setRejectDialogOpen(false);
            setSelectedNote(null);
        });
    };

    if (notes.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No pending notes to review</p>
                    <p className="text-sm text-muted-foreground mt-1">All caught up! 🎉</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-4">
                {notes.map((note) => (
                    <Card key={note.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 min-w-0 flex-1">
                                    <CardTitle className="text-lg">{note.title}</CardTitle>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="secondary" className="max-w-[200px] inline-block overflow-hidden text-ellipsis whitespace-nowrap" title={note.course.name}>
                                            {note.course.name}
                                        </Badge>
                                        <Badge variant="outline">{note.department.departmentCode.toUpperCase()}</Badge>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 shrink-0">
                                    Pending
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Author info */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{note.user.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>{note.faculty.name}</span>
                                </div>
                            </div>

                            {/* File previews */}
                            {note.files.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {note.files.slice(0, 4).map((file) => {
                                        const isPDF = file.url.includes('.pdf') || file.url.includes('f_pdf');
                                        return (
                                            <div
                                                key={file.id}
                                                className="relative w-16 h-16 bg-muted rounded border overflow-hidden"
                                            >
                                                {isPDF ? (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FileText className="w-6 h-6 text-muted-foreground" />
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={file.url}
                                                        alt="File preview"
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                    {note.files.length > 4 && (
                                        <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                +{note.files.length - 4}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Resources */}
                            {note.resources.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Resources:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {note.resources.slice(0, 3).map((resource) => (
                                            <a
                                                key={resource.id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                {new URL(resource.url).hostname}
                                            </a>
                                        ))}
                                        {note.resources.length > 3 && (
                                            <span className="text-xs text-muted-foreground">
                                                +{note.resources.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <Button
                                    size="sm"
                                    onClick={() => handleApprove(note.id)}
                                    disabled={isPending && processingId === note.id}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isPending && processingId === note.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openRejectDialog(note)}
                                    disabled={isPending && processingId === note.id}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Note</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject &quot;{selectedNote?.title}&quot;?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            placeholder="Provide a reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : null}
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
