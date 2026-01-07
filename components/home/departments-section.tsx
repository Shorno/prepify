"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, BookMarked } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

interface DepartmentsSectionProps {
    departments: {
        success: boolean;
        data?: { id: number; name: string; code: string; noteCount: number }[];
        error?: string
    };
}

export default function DepartmentsSection({ departments }: DepartmentsSectionProps) {
    if (!departments.success || !departments.data || departments.data.length === 0) {
        return null;
    }

    return (
        <section className="py-20 w-full md:py-32 bg-muted/30 border-t border-border/20">
            <div className="container px-4 md:px-6 mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">Browse by Department</h2>
                        <p className="text-muted-foreground text-lg">
                            Find study materials specific to your field of study. Including engineering, sciences, arts, and more.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {departments.data.map((dept, index) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link href={`/notes?departmentId=${dept.id}`} className="block h-full">
                                <Card className="h-full p-6 hover:shadow-md transition-all duration-300 hover:border-primary/50 group bg-card">
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                <BookMarked className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                                {dept.code.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{dept.name}</h3>
                                            <p className="text-muted-foreground text-sm">{dept.noteCount} Resources</p>
                                        </div>
                                        <div className="flex items-center text-primary text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-2">
                                            Explore Notes <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
