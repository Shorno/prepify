"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitModeratorApplication } from "@/actions/moderator/moderator-application-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Clock,
    Eye,
    Scale,
    FileCheck,
    Lock,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import { type ModeratorApplication } from "@/db/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModeratorApplicationFormProps {
    existingApplication: ModeratorApplication | null;
}

const moderatorRules = [
    {
        icon: Clock,
        title: "Be Active & Responsive",
        description: "Moderators should be regularly active on the platform to handle issues promptly."
    },
    {
        icon: FileCheck,
        title: "Review Notes Timely",
        description: "Review and approve submitted notes within a reasonable timeframe to keep content flowing."
    },
    {
        icon: Eye,
        title: "Monitor User Activity",
        description: "Keep an eye on user behavior and address any violations of community guidelines."
    },
    {
        icon: Scale,
        title: "Be Fair & Unbiased",
        description: "Make decisions objectively without favoritism. Treat all users equally."
    },
    {
        icon: ShieldCheck,
        title: "Follow Community Guidelines",
        description: "Lead by example by strictly adhering to all platform rules and policies."
    },
    {
        icon: Lock,
        title: "Maintain Confidentiality",
        description: "Keep user reports and sensitive information confidential at all times."
    }
];

export function ModeratorApplicationForm({ existingApplication }: ModeratorApplicationFormProps) {
    const [agreed, setAgreed] = useState(false);
    const [motivation, setMotivation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!agreed) {
            toast.error("Please agree to the moderator guidelines");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitModeratorApplication(motivation || undefined);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (existingApplication) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Moderator Application</CardTitle>
                    <CardDescription>Your application status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {existingApplication.status === "pending" && (
                        <Alert>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <AlertTitle>Application Pending</AlertTitle>
                            <AlertDescription>
                                Your application is being reviewed. We&apos;ll notify you once a decision is made.
                            </AlertDescription>
                        </Alert>
                    )}
                    {existingApplication.status === "approved" && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-600">Application Approved!</AlertTitle>
                            <AlertDescription>
                                Congratulations! You are now a moderator. Welcome to the team!
                            </AlertDescription>
                        </Alert>
                    )}
                    {existingApplication.status === "rejected" && (
                        <div className="space-y-4">
                            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <AlertTitle className="text-red-600">Application Not Approved</AlertTitle>
                                <AlertDescription>
                                    {existingApplication.rejectionReason ||
                                        "Your application was not approved at this time. You can apply again."}
                                </AlertDescription>
                            </Alert>
                            <Button
                                onClick={() => router.refresh()}
                                variant="outline"
                                className="w-full"
                            >
                                Apply Again
                            </Button>
                        </div>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                        <p>Applied on: {new Date(existingApplication.createdAt).toLocaleDateString()}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Become a Moderator</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Help us keep Prepify safe and fair for everyone. As a moderator, you&apos;ll play
                    a crucial role in maintaining our community standards.
                </p>
            </div>

            {/* Rules Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Moderator Guidelines & Responsibilities</CardTitle>
                    <CardDescription>
                        Please read and understand these responsibilities before applying
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {moderatorRules.map((rule) => (
                            <div
                                key={rule.title}
                                className="flex gap-3 p-4 rounded-lg border bg-muted/50"
                            >
                                <rule.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-sm">{rule.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {rule.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit Your Application</CardTitle>
                    <CardDescription>
                        Tell us why you want to become a moderator
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Motivation (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="motivation">
                            Why do you want to be a moderator? <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Textarea
                            id="motivation"
                            placeholder="Share your motivation for becoming a moderator..."
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                        <Checkbox
                            id="agree"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgreed(checked === true)}
                        />
                        <Label
                            htmlFor="agree"
                            className="text-sm leading-relaxed cursor-pointer"
                        >
                            I have read and agree to follow all the moderator guidelines above.
                            I understand that failure to comply may result in removal of my moderator status.
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!agreed || isSubmitting}
                        className="w-full"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Submit Application
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
