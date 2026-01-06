"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    approveApplication,
    rejectApplication
} from "@/actions/moderator/moderator-application-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PendingApplication {
    id: string;
    userId: string;
    status: "pending" | "approved" | "rejected";
    motivation: string | null;
    createdAt: Date;
    userName: string;
    userEmail: string;
    userImage: string | null;
    username: string | null;
}

interface PendingApplicationsProps {
    applications: PendingApplication[];
}

export function PendingApplications({ applications }: PendingApplicationsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<PendingApplication | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleApprove = async (applicationId: string) => {
        setProcessingId(applicationId);
        startTransition(async () => {
            const result = await approveApplication(applicationId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
            setProcessingId(null);
        });
    };

    const openRejectDialog = (application: PendingApplication) => {
        setSelectedApplication(application);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    const handleReject = async () => {
        if (!selectedApplication) return;

        setProcessingId(selectedApplication.id);
        startTransition(async () => {
            const result = await rejectApplication(selectedApplication.id, rejectionReason || undefined);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
            setProcessingId(null);
            setRejectDialogOpen(false);
            setSelectedApplication(null);
        });
    };

    if (applications.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No pending applications</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-4">
                {applications.map((application) => (
                    <Card key={application.id}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={application.userImage || ""} alt={application.userName} />
                                        <AvatarFallback>
                                            {application.userName?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{application.userName}</p>
                                        <p className="text-sm text-muted-foreground">{application.userEmail}</p>
                                        {application.username && (
                                            <p className="text-xs text-muted-foreground">@{application.username}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </Badge>
                                </div>
                            </div>

                            {application.motivation && (
                                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm font-medium mb-1">Motivation:</p>
                                    <p className="text-sm text-muted-foreground">{application.motivation}</p>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4">
                                <Button
                                    size="sm"
                                    onClick={() => handleApprove(application.id)}
                                    disabled={isPending && processingId === application.id}
                                >
                                    {isPending && processingId === application.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openRejectDialog(application)}
                                    disabled={isPending && processingId === application.id}
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
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject {selectedApplication?.userName}&apos;s application?
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
