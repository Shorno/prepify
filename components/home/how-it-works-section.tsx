"use client";

import { Upload, Trophy, BookOpen } from "lucide-react";
import { motion } from "motion/react";

const steps = [
    {
        icon: Upload,
        title: "Share Your Knowledge",
        description: "Upload your high-quality class notes and study materials to help fellow students succeed."
    },
    {
        icon: Trophy,
        title: "Earn Reputation",
        description: "Get recognized for your contributions, earn points, and climb the community leaderboard."
    },
    {
        icon: BookOpen,
        title: "Learn & Grow",
        description: "Access a vast library of peer-reviewed resources to ace your exams and master your subjects."
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-20 md:py-32 w-full bg-muted/30 border-y border-border/20">
            <div className="container px-4 md:px-6 mx-auto w-full">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">How Prepify Works</h2>
                    <p className="text-muted-foreground text-lg">
                        Join a community of scholars helping each other succeed through knowledge sharing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-border/0 via-border to-border/0 top-[3rem] -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center relative bg-background/0"
                        >
                            <div className="w-24 h-24 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-6 z-10 relative group transition-all hover:scale-110 hover:border-primary/50 duration-300">
                                <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                                <step.icon className="w-10 h-10 text-primary relative z-10" strokeWidth={1.5} />
                                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold shadow-sm">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
