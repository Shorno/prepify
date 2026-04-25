"use client"

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateExplanation } from "@/actions/ai/generate-explanation";
import type { AIExplanationRecord } from "@/db/schema/ai-explanation";
import {
    Sparkles,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Brain,
    ListOrdered,
    Lightbulb,
    AlertTriangle,
    Tag,
    Loader2,
    Bot,
} from "lucide-react";

const MAX_REGENERATIONS = 3;

interface AiExplanationPanelProps {
    noteId: number;
    isUploader: boolean;
    initialExplanation: AIExplanationRecord | null;
    courseName: string;
}

export default function AiExplanationPanel({
    noteId,
    isUploader,
    initialExplanation,
    courseName,
}: AiExplanationPanelProps) {
    const [explanation, setExplanation] = useState<AIExplanationRecord | null>(initialExplanation);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isPending, startTransition] = useTransition();

    const isGenerating = isPending || explanation?.status === "generating";
    const hasExplanation = explanation?.status === "ready";
    const hasFailed = explanation?.status === "failed";
    const regenerationsLeft = MAX_REGENERATIONS - (explanation?.regenerateCount ?? 0);

    const handleGenerate = () => {
        startTransition(async () => {
            const result = await generateExplanation(noteId);
            if (result.success) {
                setExplanation(result.data);
                toast.success(result.message || "AI explanation generated!");
            } else {
                toast.error(result.error);
            }
        });
    };

    // --- No explanation & not the uploader ---
    if (!hasExplanation && !isUploader && !isGenerating) {
        return (
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Brain className="w-5 h-5" />
                    <p className="text-sm">AI explanation not yet available for this note</p>
                </div>
            </div>
        );
    }

    // --- Uploader: Generate button (no explanation yet) ---
    if (!hasExplanation && !isGenerating && isUploader) {
        return (
            <div className="space-y-3">
                <button
                    onClick={handleGenerate}
                    disabled={isPending}
                    className={cn(
                        "w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30",
                        "bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5",
                        "p-8 transition-all duration-300",
                        "hover:border-primary/50 hover:from-primary/10 hover:to-violet-500/10",
                        "hover:shadow-lg hover:shadow-primary/5",
                        "cursor-pointer"
                    )}
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-base font-semibold text-foreground">
                                Generate AI Explanation
                            </p>
                            <p className="text-sm text-muted-foreground">
                                AI will analyze your handwritten notes and create a structured explanation
                            </p>
                        </div>
                    </div>
                </button>

                {hasFailed && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <p>Previous generation failed. Click above to try again.</p>
                    </div>
                )}
            </div>
        );
    }

    // --- Loading state ---
    if (isGenerating) {
        return (
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-base font-semibold text-foreground">
                            Analyzing your notes...
                        </p>
                        <p className="text-sm text-muted-foreground">
                            AI is reading {courseName} notes and generating a structured explanation
                        </p>
                    </div>
                    {/* Skeleton preview */}
                    <div className="w-full mt-4 space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-muted/60 rounded-full animate-pulse" style={{ width: `${70 + i * 8}%` }} />
                                <div className="h-3 bg-muted/40 rounded-full animate-pulse" style={{ width: `${50 + i * 12}%` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- Explanation ready ---
    const steps = (explanation?.steps as { stepNumber: number; title: string; content: string }[]) || [];
    const keyConcepts = (explanation?.keyConcepts as { name: string; description: string }[]) || [];
    const topics = (explanation?.topics as string[]) || [];

    return (
        <div className="rounded-2xl border border-primary/20 overflow-hidden bg-card">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center justify-between px-5 py-4",
                    "bg-gradient-to-r from-primary/10 via-primary/5 to-violet-500/10",
                    "hover:from-primary/15 hover:to-violet-500/15 transition-all duration-300",
                    "cursor-pointer"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/15 p-2">
                        <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-foreground">
                            AI Explanation
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Powered by {explanation?.modelUsed || "AI"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isUploader && regenerationsLeft > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGenerate();
                            }}
                            disabled={isPending}
                            className="text-xs text-muted-foreground hover:text-primary gap-1.5 rounded-full"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Regenerate ({regenerationsLeft})
                        </Button>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 space-y-6">
                            {/* Summary */}
                            {explanation?.summary && (
                                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                                    <p className="text-sm leading-relaxed text-foreground">
                                        {explanation.summary}
                                    </p>
                                </div>
                            )}

                            {/* Steps */}
                            {steps.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <ListOrdered className="w-4 h-4 text-primary" />
                                        Step-by-Step Breakdown
                                    </div>
                                    <div className="space-y-3">
                                        {steps.map((step, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-3 rounded-xl bg-muted/30 p-4 border border-border/30"
                                            >
                                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">
                                                        {step.stepNumber}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {step.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Concepts */}
                            {keyConcepts.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        Key Concepts & Formulas
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {keyConcepts.map((concept, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3 space-y-1"
                                            >
                                                <p className="text-sm font-semibold text-foreground">
                                                    {concept.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {concept.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Observations */}
                            {explanation?.observations && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                                        Notes & Observations
                                    </div>
                                    <div className="rounded-xl bg-orange-500/5 border border-orange-500/15 p-4">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {explanation.observations}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Topics */}
                            {topics.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Tag className="w-4 h-4 text-primary" />
                                        Topics
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {topics.map((topic, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                                <Bot className="w-3.5 h-3.5" />
                                <span>
                                    AI-generated explanation · {explanation?.modelUsed} · May contain inaccuracies
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
