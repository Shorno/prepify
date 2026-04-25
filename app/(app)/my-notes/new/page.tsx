import NewNoteForm from "@/app/(app)/my-notes/new/_components/new-note-form";
import { PenLine, Sparkles, Camera, Trophy } from "lucide-react";

export default function NewNotesPage() {
    return (
        <div className="main-container my-12 sm:my-20">
            {/* Header Section */}
            <div className="relative mb-5 overflow-hidden">
                {/* Background decorative layer */}
                <div className="absolute inset-0 -mx-4 rounded-3xl bg-gradient-to-b from-primary/[0.04] via-secondary/[0.03] to-transparent" />
                <div className="absolute inset-0 -mx-4 rounded-3xl pattern-dots-sm pointer-events-none" />

                {/* Decorative blobs */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/[0.04] blob-shape blur-2xl pointer-events-none" />
                <div className="absolute -top-6 -right-10 w-32 h-32 bg-secondary/[0.06] blob-shape-alt blur-2xl pointer-events-none" />

                {/* Content */}
                <div className="relative py-8 sm:py-10 text-center">
                    {/* Icon */}
                    <div className="animate-slide-up">
                        <div className="relative inline-flex mb-6">
                            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-warm-lg rotate-3 transition-transform hover:rotate-0 duration-300">
                                <PenLine className="w-8 h-8 text-primary-foreground" />
                            </div>
                            {/* Sparkle accent */}
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-warm-sm animate-bounce-soft">
                                <Sparkles className="w-3 h-3 text-secondary-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient animate-slide-up">
                        Share Your Notes
                    </h1>

                    {/* Subtitle */}
                    <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed animate-slide-up">
                        Help your peers learn — upload your handwritten notes
                        <br className="hidden sm:block" />
                        and earn points on the leaderboard
                    </p>

                    {/* Feature chips */}
                    <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 animate-slide-up">
                        <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border/60 px-4 py-2 shadow-warm-sm hover-lift">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Camera className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-foreground">Clear photos get more views</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border/60 px-4 py-2 shadow-warm-sm hover-lift">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-foreground">AI explanations after approval</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border/60 px-4 py-2 shadow-warm-sm hover-lift">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-foreground">Earn points & badges</span>
                        </div>
                    </div>
                </div>
            </div>

            <NewNoteForm />
        </div>
    )
}