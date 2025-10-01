"use client";
import { motion } from "framer-motion";
import { ReactNode, FormEvent } from "react";

interface LeadMagnetItem {
    text: string;
}

interface LeadMagnetSectionProps {
    badge?: string;
    title: ReactNode;
    subtitle: string;
    benefits: LeadMagnetItem[];
    bonusItem?: string;
    ctaText: string;
    onSubmit?: (email: string) => void | Promise<void>;
    disclaimer?: string;
}

export function LeadMagnetSection({
    badge,
    title,
    subtitle,
    benefits,
    bonusItem,
    ctaText,
    onSubmit,
    disclaimer,
}: LeadMagnetSectionProps) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        if (onSubmit && email) {
            onSubmit(email);
        }
    };

    return (
        <section id="lead-magnet" className="py-24 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/10 to-black" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center"
                >
                    {badge && (
                        <div className="inline-block mb-6 px-4 py-2 bg-primary/20 border border-primary/50 rounded-full text-sm text-primary font-medium">
                            {badge}
                        </div>
                    )}

                    <h2 className="text-4xl md:text-5xl mb-3">{title}</h2>
                    <p className="text-xl md:text-2xl text-gray-300 mb-12">{subtitle}</p>

                    <div className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
                        <h3 className="text-2xl mb-6">What You&apos;ll Get</h3>
                        <ul className="text-left max-w-2xl mx-auto space-y-4 text-gray-300 mb-8">
                            {benefits.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">✓</span>
                                    <span className="flex-1">{item.text}</span>
                                </li>
                            ))}
                            {bonusItem && (
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">✓</span>
                                    <span className="flex-1">{bonusItem}</span>
                                </li>
                            )}
                        </ul>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-6">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                className="w-full px-6 py-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full bg-primary text-black px-8 py-4 text-lg font-medium rounded-lg hover:bg-primary/90 transition-all"
                            >
                                {ctaText}
                            </button>
                        </form>

                        {disclaimer && (
                            <p className="text-sm text-gray-500">{disclaimer}</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
