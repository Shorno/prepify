"use client";

import { motion } from "motion/react";

interface StatsSectionProps {
    stats: {
        success: boolean;
        data?: {
            notesCount: number;
            usersCount: number;
            totalViews: number;
            departmentsCount: number;
        };
        error?: string;
    };
}

export default function StatsSection({ stats }: StatsSectionProps) {
    if (!stats.success || !stats.data) {
        return null;
    }

    const { notesCount, usersCount, totalViews, departmentsCount } = stats.data;

    const statItems = [
        { label: "Total Notes", value: notesCount, suffix: "+" },
        { label: "Active Contributors", value: usersCount, suffix: "+" },
        { label: "Total Views", value: totalViews, suffix: "" },
        { label: "Departments", value: departmentsCount, suffix: "+" },
    ];

    return (
        <section className="py-20 w-full border-t border-border/20 bg-background">
            <div className="container px-4 md:px-6 mx-auto w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {statItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center space-y-2"
                        >
                            <div className="text-4xl md:text-5xl font-bold font-serif text-primary">
                                {item.value.toLocaleString()}{item.suffix}
                            </div>
                            <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
                                {item.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
