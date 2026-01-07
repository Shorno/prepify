"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <section className="py-24 md:py-32 w-full relative overflow-hidden">
            {/* Background with pattern */}
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10 w-full">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif"
                    >
                        Ready to Start Learning?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Join thousands of students who are already sharing notes and acing their exams with Prepify.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl hover:shadow-primary/25 transition-all duration-300" asChild>
                            <Link href="/sign-up">
                                Get Started for Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
