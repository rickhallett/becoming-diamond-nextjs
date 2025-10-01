"use client";
import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

interface Testimonial {
    quote: string;
    name: string;
    designation: string;
    src: string;
}

interface TestimonialsSectionProps {
    title: string;
    subtitle?: string;
    testimonials: Testimonial[];
    autoplay?: boolean;
}

export function TestimonialsSection({
    title,
    subtitle,
    testimonials,
    autoplay = true,
}: TestimonialsSectionProps) {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-black via-secondary/50 to-black">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <h2 className="mb-6">{title}</h2>
                    {subtitle && (
                        <p className="text-xl text-gray-300">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                <AnimatedTestimonials
                    testimonials={testimonials}
                    autoplay={autoplay}
                />
            </div>
        </section>
    );
}
