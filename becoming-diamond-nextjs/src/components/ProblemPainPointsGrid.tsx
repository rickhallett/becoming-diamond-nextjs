"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface PainPoint {
    title: string;
    description: string;
}

interface Quote {
    text: ReactNode;
    author: string;
}

interface ProblemPainPointsGridProps {
    title: ReactNode;
    subtitle: ReactNode;
    painPoints: PainPoint[];
    quote?: Quote;
    backgroundEffect?: boolean;
}

export function ProblemPainPointsGrid({
    title,
    subtitle,
    painPoints,
    quote,
    backgroundEffect = true,
}: ProblemPainPointsGridProps) {
    return (
        <section id="problem" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
            {backgroundEffect && <BackgroundBeams className="opacity-30" />}

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <h2 className="mb-6">{title}</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {painPoints.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-all"
                        >
                            <h3 className="text-xl mb-3 font-normal">{item.title}</h3>
                            <p className="text-gray-400 text-base">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

                {quote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <blockquote className="text-2xl md:text-3xl font-light italic text-gray-300 max-w-4xl mx-auto">
                            {quote.text}
                            <span className="text-gray-600"> ~ {quote.author}</span>
                        </blockquote>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
