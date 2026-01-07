"use client";

import NoteCard from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { NotesWithRelations } from "@/db/schema";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

interface FeaturedNotesSectionProps {
    notes: { success: boolean; data?: NotesWithRelations[]; error?: string };
}

export default function FeaturedNotesSection({ notes }: FeaturedNotesSectionProps) {
    if (!notes.success || !notes.data || notes.data.length === 0) {
        return null; // Don't render if no data
    }

    return (
        <section className="py-20 md:py-32 w-full bg-background/50 border-t border-border/20">
            <div className="container px-4 md:px-6 mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary w-fit">
                            <Star className="mr-1.5 h-3 w-3 fill-primary/20" />
                            <span>Staff Picks</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">Featured Notes</h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Discover the most popular and high-quality study materials curated by our community.
                        </p>
                    </div>
                    <Button variant="ghost" className="group hidden md:flex" asChild>
                        <Link href="/notes">
                            View all notes
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {notes.data.map((note, index) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <NoteCard data={note} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center md:hidden">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/notes">
                            View all notes
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
