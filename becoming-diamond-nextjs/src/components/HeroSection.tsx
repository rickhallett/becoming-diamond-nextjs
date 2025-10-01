"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

interface CTAButton {
    text: string;
    onClick: () => void;
}

interface SocialProof {
    stat: string;
    testimonial: string;
    author: string;
}

interface HeroSectionProps {
    badge?: string;
    title: ReactNode;
    subtitle: ReactNode;
    primaryCta?: CTAButton;
    secondaryCta?: CTAButton;
    socialProof?: SocialProof;
}

export function HeroSection({
    badge,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    socialProof,
}: HeroSectionProps) {
    return (
        <section className="min-h-screen flex items-center justify-center relative">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4fc3f7" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-[1]" />

            <motion.div
                className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
            >
                {badge && (
                    <motion.div
                        className="inline-block mb-6 px-4 py-2 border border-primary/30 rounded-full text-sm text-primary"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {badge}
                    </motion.div>
                )}

                <h1 className="mb-8 leading-none">{title}</h1>

                <p className="text-xl md:text-2xl font-light text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                    {subtitle}
                </p>

                {(primaryCta || secondaryCta) && (
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        {primaryCta && (
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                onClick={primaryCta.onClick}
                                className="bg-black text-white px-8 py-4 text-lg font-medium"
                            >
                                {primaryCta.text}
                            </HoverBorderGradient>
                        )}

                        {secondaryCta && (
                            <motion.button
                                className="border border-primary/50 text-primary px-8 py-4 text-lg font-medium rounded-full hover:bg-primary/10 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={secondaryCta.onClick}
                            >
                                {secondaryCta.text}
                            </motion.button>
                        )}
                    </div>
                )}

                {socialProof && (
                    <motion.div
                        className="text-gray-400 space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-lg">{socialProof.stat}</p>
                        <p className="italic">&ldquo;{socialProof.testimonial}&rdquo; - {socialProof.author}</p>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
