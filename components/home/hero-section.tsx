"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden w-full bg-background pt-16 md:pt-24 lg:pt-32 pb-16">
            {/* Decorative background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10 w-full mx-auto">
                <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
                    >
                        <Sparkles className="mr-2 h-3.5 w-3.5 fill-primary/20" />
                        <span className="text-xs md:text-sm">The Smartest Way to Share Knowledge</span>
                    </motion.div>

                    {/* Headline */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
                        >
                            Elevate Your <br className="hidden md:block" />
                            <span className="text-primary italic font-serif pr-2">Academic Journey</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed"
                        >
                            Access thousands of high-quality study notes, share your knowledge, and climb the leaderboard in our thriving academic community.
                        </motion.p>
                    </div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
                    >
                        <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300" asChild>
                            <Link href="/notes">
                                Browse Notes
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-2 hover:bg-muted transition-all duration-300" asChild>
                            <Link href="/my-notes/new">
                                Share Your Notes
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="pt-12 md:pt-16 w-full max-w-3xl mx-auto border-t border-border/50 grid grid-cols-3 gap-4 md:gap-8"
                    >
                        {[
                            { label: "Active Students", value: "2k+" },
                            { label: "Study Resources", value: "5k+" },
                            { label: "Universities", value: "10+" },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center space-y-1">
                                <span className="text-2xl md:text-3xl font-bold text-foreground font-serif">{stat.value}</span>
                                <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
