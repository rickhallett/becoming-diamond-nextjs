"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { SparklesBackground } from "@/components/ui/sparkles-background";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { MovingBorder } from "@/components/ui/moving-border";
import { LampContainer } from "@/components/ui/lamp";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
    ssr: false,
});

export default function LandingAltAll() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const globeConfig = {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#4fc3f7",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(79,195,247,0.7)",
        ambientLight: "#4fc3f7",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 34.0522, lng: -118.2437 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };

    const colors = ["#4fc3f7", "#06b6d4", "#3b82f6"];
    const sampleArcs = [
        {
            order: 1,
            startLat: 34.0522,
            startLng: -118.2437,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.3,
            color: colors[0],
        },
        {
            order: 2,
            startLat: 51.5072,
            startLng: -0.1276,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.3,
            color: colors[1],
        },
        {
            order: 3,
            startLat: -33.8688,
            startLng: 151.2093,
            endLat: 34.0522,
            endLng: -118.2437,
            arcAlt: 0.5,
            color: colors[2],
        },
        {
            order: 4,
            startLat: 35.6762,
            startLng: 139.6503,
            endLat: 34.0522,
            endLng: -118.2437,
            arcAlt: 0.4,
            color: colors[0],
        },
        {
            order: 5,
            startLat: 48.8566,
            startLng: 2.3522,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.3,
            color: colors[1],
        },
        {
            order: 6,
            startLat: -23.5505,
            startLng: -46.6333,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.4,
            color: colors[2],
        },
    ];

    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-sm py-4" : "bg-transparent py-6"}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="text-xl font-thin tracking-wider">
                        BECOMING DIAMOND
                    </Link>
                    <div className="flex gap-8">
                        <Link href="#problem" className="hover:text-primary transition-colors">
                            The Problem
                        </Link>
                        <Link href="#solution" className="hover:text-primary transition-colors">
                            Solution
                        </Link>
                        <Link href="#offers" className="hover:text-primary transition-colors">
                            Transform
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Shark Tank Pitch Energy */}
            <section className="min-h-screen flex items-center justify-center relative">
                <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4fc3f7" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-[1]" />

                <motion.div
                    className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
                >
                    <motion.div
                        className="inline-block mb-6 px-4 py-2 border border-primary/30 rounded-full text-sm text-primary"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        The Antidote to the AI Anxiety Epidemic
                    </motion.div>

                    <h1 className="mb-8 leading-none">
                        While Everyone's Panicking About <span className="text-primary">AI</span>,<br />
                        We're Training the <span className="text-primary">One Thing</span><br />
                        Machines Will Never Replace
                    </h1>

                    <p className="text-xl md:text-2xl font-light text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                        Master <span className="text-primary font-normal">human presence under pressure</span>.
                        Regulate your nervous system. Rewire your identity.
                        Lead with <span className="text-primary font-normal">unshakable clarity</span>—even when everything around you is chaos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <HoverBorderGradient
                            containerClassName="rounded-full"
                            as="button"
                            onClick={() => document.getElementById('lead-magnet')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-black text-white px-8 py-4 text-lg font-medium"
                        >
                            Get the Free Diamond Sprint
                        </HoverBorderGradient>

                        <motion.button
                            className="border border-primary/50 text-primary px-8 py-4 text-lg font-medium rounded-full hover:bg-primary/10 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            See How It Works
                        </motion.button>
                    </div>

                    <motion.div
                        className="text-gray-400 space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-lg">Over 2,000 professionals increased their income by an average of <span className="text-primary font-semibold">2x in just 5 days</span></p>
                        <p className="italic">"I'm not the same person I was a week ago." - Misty R.</p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Globe Section - Global Community */}
            <section className="py-24 px-6 bg-black relative">
                <div className="max-w-7xl mx-auto w-full relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative z-10 mb-8"
                    >
                        <h2 className="text-center mb-4">
                            Join a Global <span className="text-primary">Revolution</span>
                        </h2>
                        <p className="text-center text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Thousands of leaders, entrepreneurs, and change-makers across six continents are transforming pressure into clarity. The collective is growing. Your place is waiting.
                        </p>
                    </motion.div>

                    <div className="flex justify-center w-full">
                        <div className="relative overflow-hidden" style={{ width: '768px', height: '640px', maxWidth: '100%' }}>
                            <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-black z-40" />
                            <div className="w-full h-full z-10">
                                <World data={sampleArcs} globeConfig={globeConfig} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem - Pain Points */}
            <section id="problem" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
                <BackgroundBeams className="opacity-30" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="mb-6">The <span className="text-primary">Pressure</span> You're Under<br />Isn't the Problem</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            It's that your <span className="text-primary">nervous system</span> isn't trained for it
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                title: "Burned Out by Hustle Culture",
                                description: "You're high-functioning but emotionally exhausted. Something is 'off' but you can't name it."
                            },
                            {
                                title: "Identity Crisis",
                                description: "After a major life change—divorce, layoff, or transition—you're trying to find your purpose again."
                            },
                            {
                                title: "AI Anxiety",
                                description: "You fear becoming irrelevant in a world that's moving too fast. Will you be replaced?"
                            },
                            {
                                title: "Lost Confidence",
                                description: "You never feel truly confident. Imposter syndrome follows you into every room."
                            },
                            {
                                title: "Emotional Dysregulation",
                                description: "Your emotions spike and crash. You're triggered easily and can't get back to center."
                            },
                            {
                                title: "Living Small",
                                description: "You're terrified of living a small life—of not being able to protect or provide for your family."
                            }
                        ].map((item, index) => (
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

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <blockquote className="text-2xl md:text-3xl font-light italic text-gray-300 max-w-4xl mx-auto">
                            "You can't <span className="text-primary not-italic">think</span> your way into a new identity.<br />
                            Your nervous system is running the show.<br />
                            That's why willpower fails."
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            {/* The Solution - Diamond Operating System */}
            <section id="solution" className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="mb-6">
                            Introducing the <span className="text-primary">Diamond Operating System</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            A complete transformation system that rewires how you think, feel, and show up under pressure
                        </p>
                    </motion.div>

                    <BentoGrid className="mb-16">
                        <BentoGridItem
                            title="The Diamond Operating System"
                            description="Converts pressure into clarity, chaos into calm. You don't just react better—you lead better. You become the person people trust in crisis."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
                            }
                            className="md:col-span-2"
                        />
                        <BentoGridItem
                            title="Swiss Army Knife"
                            description="Real-time emotional regulation. Get back to center instantly, no matter what's happening. Body, Breath, Brain tools."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
                            }
                        />
                        <BentoGridItem
                            title="ART & ART² Protocols"
                            description="Clears emotional static and reclaims your power. Transform fear, anger, and doubt into intentional action."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
                            }
                        />
                        <BentoGridItem
                            title="The Diamond Sprint"
                            description="30-Day Practice that installs new habits and baseline identity. Build unshakable confidence through consistent action."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
                            }
                            className="md:col-span-2"
                        />
                    </BentoGrid>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">
                            This isn't theory. This is <span className="text-primary font-normal">embodied transformation</span>.
                        </p>
                        <blockquote className="text-lg italic text-gray-400 max-w-3xl mx-auto border-l-2 border-primary pl-6 text-left">
                            "Diamonds don't resist pressure; they're formed by it. They emerge clearer, stronger,
                            and more valuable than before. This is about building that response—not in theory,
                            but in the wiring of your nervous system."
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof - Testimonials */}
            <section className="py-24 px-6 bg-gradient-to-b from-black via-secondary/50 to-black">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="mb-6">What People Are Saying</h2>
                        <p className="text-xl text-gray-300">
                            Real transformations from real people
                        </p>
                    </motion.div>

                    <AnimatedTestimonials
                        testimonials={[
                            {
                                quote: "I'm not the same person I was a week ago. The Diamond Operating System gave me tools that actually work under real pressure.",
                                name: "Misty R.",
                                designation: "Sales Executive",
                                src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop"
                            },
                            {
                                quote: "Michael gave me tools that actually work under real pressure. My entire nervous system feels upgraded.",
                                name: "Mark T.",
                                designation: "Corporate Leader",
                                src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop"
                            },
                            {
                                quote: "My entire nervous system feels upgraded. I show up stronger in every meeting and relationship—without losing myself.",
                                name: "Fernando G.",
                                designation: "Entrepreneur",
                                src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&fit=crop"
                            }
                        ]}
                        autoplay={true}
                    />
                </div>
            </section>

            {/* Lead Magnet - Free Diamond Sprint */}
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
                        <div className="inline-block mb-6 px-4 py-2 bg-primary/20 border border-primary/50 rounded-full text-sm text-primary font-medium">
                            FREE DOWNLOAD
                        </div>

                        <h2 className="mb-6">
                            Turning <span className="text-primary">Pressure</span> Into Power
                        </h2>
                        <p className="text-xl text-gray-300 mb-12">
                            Get the Free Diamond Sprint + Manifesto
                        </p>

                        <div className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
                            <h3 className="text-2xl mb-6">What You'll Get</h3>
                            <ul className="text-left max-w-2xl mx-auto space-y-4 text-gray-300 mb-8">
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">✓</span>
                                    <span className="flex-1">The Diamond Manifesto – Daily identity upgrade ritual</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">✓</span>
                                    <span className="flex-1">The 30-Day Diamond Sprint – Nervous system training tracker</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">✓</span>
                                    <span className="flex-1">Swiss Army Knife Reset Guide – Emotional regulation cheat sheet</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">✓</span>
                                    <span className="flex-1">BONUS Audio: "The Boss: Who's Really Running Your Life?"</span>
                                </li>
                            </ul>

                            <div className="max-w-md mx-auto space-y-4 mb-6">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-6 py-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                />
                                <HoverBorderGradient
                                    containerClassName="rounded-lg w-full"
                                    as="button"
                                    className="bg-primary text-black px-8 py-4 text-lg font-medium w-full"
                                >
                                    Yes, I Want the Free Diamond Sprint
                                </HoverBorderGradient>
                            </div>

                            <p className="text-sm text-gray-500">
                                Discover the 3 tools that helped thousands regulate stress, rewire identity,
                                and lead through chaos—in just 15 minutes a day.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Offer - Diamond Activation Experience */}
            <section id="offers" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="mb-6">
                            You Weren't Made to <span className="text-primary">Survive</span> Pressure.<br />
                            You Were Made to <span className="text-primary">Become Something</span> Under It.
                        </h2>
                        <p className="text-xl text-gray-300">
                            The Diamond Activation Experience
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl mb-6">The Problem</h3>
                            <div className="space-y-4 text-gray-300">
                                <p>You feel <span className="text-primary">stuck</span>—not because you're lazy, but because you've outgrown your current identity.</p>
                                <p>Your nervous system is dysregulated. Your emotions spike and crash. Your confidence wavers.</p>
                                <p>And no amount of positive thinking, productivity hacks, or hustle is fixing it.</p>
                                <p className="text-lg font-normal text-white">Because the problem isn't your mindset. It's your <span className="text-primary">operating system</span>.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl mb-6">The Solution</h3>
                            <p className="text-gray-300 mb-6">
                                The Diamond Activation Experience is a complete transformation system that rewires how you think, feel, and show up under pressure.
                            </p>
                            <div className="space-y-3 text-gray-300">
                                <p className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    How to regulate your nervous system in real-time
                                </p>
                                <p className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    How to clear emotional blocks instantly
                                </p>
                                <p className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    How to install a new identity that doesn't collapse under stress
                                </p>
                                <p className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    How to lead with magnetic presence
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pricing Options */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                name: "Recorded Version",
                                price: "$97",
                                description: "Self-paced transformation",
                                features: [
                                    "Full Diamond Operating System Course",
                                    "Swiss Army Knife Toolkit",
                                    "ART & ART² Protocols",
                                    "30-Day Diamond Sprint Tracker",
                                    "Lifetime Access"
                                ],
                                cta: "Get Started",
                                popular: false
                            },
                            {
                                name: "Full Program",
                                price: "$497",
                                description: "Complete with live coaching",
                                features: [
                                    "Everything in Recorded Version",
                                    "3 Live Coaching Calls with Michael",
                                    "Emotional Mastery Mini-Course ($497 value)",
                                    "Influence Masterclass ($297 value)",
                                    "Private Diamond Forum (Priceless)",
                                    "Total Value: $2,488"
                                ],
                                cta: "Start Your Transformation",
                                popular: true
                            },
                            {
                                name: "Premium",
                                price: "$3,000",
                                description: "Includes 1-on-1 mentoring",
                                features: [
                                    "Everything in Full Program",
                                    "Private 1-on-1 Sessions",
                                    "Priority Support",
                                    "Custom Action Plan",
                                    "Personalized Accountability"
                                ],
                                cta: "Apply Now",
                                popular: false
                            }
                        ].map((tier, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative rounded-2xl p-8 ${
                                    tier.popular
                                        ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary'
                                        : 'bg-secondary/50 border border-white/10'
                                }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl mb-2">{tier.name}</h3>
                                <p className="text-gray-400 mb-4">{tier.description}</p>
                                <div className="text-4xl font-light mb-6">{tier.price}</div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-gray-300">
                                            <span className="text-primary mr-2">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                                        tier.popular
                                            ? 'bg-primary text-black hover:bg-primary/90'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {tier.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
                            <h3 className="text-2xl mb-4">14-Day Unshakable Guarantee</h3>
                            <p className="text-gray-300">
                                If you don't feel more grounded, clear, and emotionally steady within 2 weeks—we'll refund every penny. No questions asked.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Premium Ascension - DiamondMind Collective */}
            <section className="py-24 px-6 relative overflow-hidden">
                <LampContainer>
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h2 className="mb-6">
                            The <span className="text-primary">DiamondMind</span> Collective
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            A Yearlong Transformation Journey for Emerging Leaders
                        </p>
                        <p className="text-2xl font-light mb-8">
                            Become the Leader Pressure Can't Break
                        </p>

                        <div className="max-w-3xl mx-auto mb-8">
                            <p className="text-lg text-gray-300 mb-6">
                                A 12-month guided journey through <span className="text-primary font-normal">5 transformational gateways</span>—each one designed to train your body, mind, and identity to operate under pressure with grace, clarity, and conviction.
                            </p>
                            <p className="text-base text-gray-400 italic">
                                This is not a course. This is not a seminar.<br />
                                This is <span className="text-primary not-italic">soul-tempering, system-level transformation</span>.
                            </p>
                        </div>

                        {/* The 5 Gateways */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto mb-8">
                            {[
                                {
                                    number: "1",
                                    name: "Stabilize",
                                    description: "Nervous system mastery, presence, self-regulation",
                                    intensity: "20"
                                },
                                {
                                    number: "2",
                                    name: "Shift",
                                    description: "Identity rewiring, emotional mastery, ego integration",
                                    intensity: "30"
                                },
                                {
                                    number: "3",
                                    name: "Strengthen",
                                    description: "Resilience, coherence, energetic stamina",
                                    intensity: "40"
                                },
                                {
                                    number: "4",
                                    name: "Shine",
                                    description: "Embodied leadership, influence, magnetic presence",
                                    intensity: "50"
                                },
                                {
                                    number: "5",
                                    name: "Synthesize",
                                    description: "Purpose, legacy, lifelong adaptability",
                                    intensity: "60"
                                }
                            ].map((gateway, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.08,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                    viewport={{ once: true }}
                                    className={`group relative bg-gradient-to-b from-primary/${gateway.intensity} to-primary/10 rounded-xl p-6 text-center cursor-pointer overflow-hidden transition-all duration-300 border-2 border-primary/20 hover:border-primary`}
                                    style={{
                                        boxShadow: '0 0 0px rgba(79,195,247,0.3)',
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 20px rgba(79,195,247,0.6), 0 0 40px rgba(79,195,247,0.4)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 0 0px rgba(79,195,247,0.3)';
                                    }}
                                >
                                    <div className="relative z-10">
                                        <div className={`text-4xl font-thin text-primary mb-3 transition-all duration-300`}>
                                            Gateway {gateway.number}
                                        </div>
                                        <h3 className="text-xl mb-3 transition-all duration-300">{gateway.name}</h3>
                                        <p className="text-sm text-gray-400 transition-all duration-300">{gateway.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </LampContainer>

                <div className="max-w-6xl mx-auto px-6 relative z-10 pt-32">

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
                    >
                        <h3 className="text-2xl mb-6 text-center">What's Included</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-300 mb-8">
                            <div className="flex items-start">
                                <span className="text-primary mr-3 text-xl">✓</span>
                                <span>5 Transformational Gateways (3-day immersives)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-primary mr-3 text-xl">✓</span>
                                <span>5 Live Integration Labs (group coaching)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-primary mr-3 text-xl">✓</span>
                                <span>Full Diamond Activation Library</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-primary mr-3 text-xl">✓</span>
                                <span>Private Portal & Community</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-primary mr-3 text-xl">✓</span>
                                <span>Diamond Manifesto 90-Day Protocol</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-primary mr-3 text-xl">✓</span>
                                <span>Frequency as Currency Training</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                                <h4 className="text-xl mb-3">Standard Investment</h4>
                                <p className="text-3xl font-light mb-2">$7,995</p>
                                <p className="text-gray-400 mb-4">Pay in Full</p>
                                <p className="text-sm text-gray-400">or $888/month × 10</p>
                            </div>
                            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/30">
                                <h4 className="text-xl mb-3">VIP Tier</h4>
                                <p className="text-3xl font-light mb-2">$10,000</p>
                                <p className="text-gray-400 mb-4">Includes:</p>
                                <ul className="text-sm text-gray-300 space-y-2">
                                    <li>• 1-on-1 Mentoring</li>
                                    <li>• Private Voxer Access</li>
                                    <li>• Front-Row Seating</li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 mb-6">
                                We're only accepting <span className="text-primary font-semibold">33 participants</span> in this cohort.
                            </p>
                            <div className="flex justify-center">
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    as="button"
                                    className="bg-primary text-black px-8 py-4 text-lg font-medium"
                                >
                                    Apply for the DiamondMind Collective
                                </HoverBorderGradient>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA - Elevator Pitches Integration */}
            <section className="py-24 px-6 bg-gradient-to-b from-black via-secondary/50 to-black">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-8">
                            This Is Your <span className="text-primary">Pressure Room</span> Moment
                        </h2>

                        <p className="text-xl text-gray-300 mb-12">
                            You're standing at a crossroads. One path: Keep doing what you've been doing.
                            Hope it works out. Try harder.<br /><br />
                            The other path: Step into the pressure room with tools, support, and a proven system.
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    "In an age of <span className="text-primary">AI and constant disruption</span>,
                                    your resilience is your most valuable asset. Stop melting under pressure and
                                    start becoming a <span className="text-primary">Diamond</span>. Whether you're in
                                    business, leadership, or transition—we help you upgrade your nervous system and
                                    identity so you can lead and perform in a world being reshaped by AI."
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                className="bg-primary text-black px-8 py-4 text-lg font-medium"
                            >
                                Start Your Free Diamond Sprint
                            </HoverBorderGradient>

                            <button
                                className="border border-primary/50 text-primary px-8 py-4 text-lg font-medium rounded-full hover:bg-primary/10 transition-all"
                            >
                                Apply for DiamondMind Collective
                            </button>
                        </div>

                        <p className="text-gray-500 mt-12 italic">
                            "Pressure doesn't build character, it reveals it."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="mb-6">Contact Us</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Ready to begin your transformation? Reach out to learn more about how Becoming Diamond can help you master pressure and lead with clarity.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Get in Touch */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl mb-8">Get in Touch</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <svg className="w-6 h-6 text-primary mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Email</div>
                                        <a href="mailto:hello@becomingdiamond.com" className="text-white hover:text-primary transition-colors">
                                            hello@becomingdiamond.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <svg className="w-6 h-6 text-primary mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Phone</div>
                                        <a href="tel:1-800-DIAMOND" className="text-white hover:text-primary transition-colors">
                                            1-800-DIAMOND
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <svg className="w-6 h-6 text-primary mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Office</div>
                                        <div className="text-white">
                                            Los Angeles, CA<br />
                                            United States
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Send us a Message */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                        >
                            <h3 className="text-2xl mb-8">Send us a Message</h3>

                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@company.com"
                                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm text-gray-400 mb-2">
                                        Company (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        placeholder="Acme Inc."
                                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        placeholder="Tell us about your transformation goals..."
                                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto text-center text-gray-500">
                    <p>&copy; 2025 Becoming Diamond. All rights reserved.</p>
                    <p className="mt-2">You weren't born to melt under pressure. You were born to become a Diamond.</p>
                </div>
            </footer>
        </main>
    );
}
