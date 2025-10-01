"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
    title: ReactNode;
    subtitle?: ReactNode;
    badge?: string;
    align?: "left" | "center" | "right";
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    badge,
    align = "center",
    className = "",
}: SectionHeaderProps) {
    const alignmentClass = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`${alignmentClass} mb-16 ${className}`}
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
            <h2 className="mb-6">{title}</h2>
            {subtitle && (
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
