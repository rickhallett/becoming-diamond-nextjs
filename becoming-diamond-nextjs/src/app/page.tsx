/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ProblemPainPointsGrid } from "@/components/ProblemPainPointsGrid";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { BookSalesSection } from "@/components/BookSalesSection";
import { SectionHeader } from "@/components/SectionHeader";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
    ssr: false,
});

export default function LandingPage() {
    const globeConfig = {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#4fc3f7",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.3,
        shininess: 0.9,
        polygonColor: "rgba(79,195,247,1)",
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
    ];

    return (
        <main className="relative bg-black antialiased">
            <Navigation />

            {/* Hero Section */}
            <HeroSection
                badge="You don't need to outpace AI. You need to out-presence it."
                title={
                    <>
                        While Everyone&apos;s Panicking About <span className="text-primary">AI</span>,<br />
                        We&apos;re Training the <span className="text-primary">One Thing</span><br />
                        Machines Will Never Replace
                    </>
                }
                subtitle={
                    <>
                        Master <span className="text-primary font-normal">presence under pressure</span>.&nbsp;
                        Regulate your nervous system.&nbsp;
                        Rewire your identity.&nbsp;
                        Lead with <span className="text-primary font-normal">unshakable clarity</span>—even when the world around you is unraveling.
                    </>
                }
                primaryCta={{
                    text: "Get the Free Diamond Sprint",
                    onClick: () => document.getElementById('lead-magnet')?.scrollIntoView({ behavior: 'smooth' })
                }}
                secondaryCta={{
                    text: "See How It Works",
                    onClick: () => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })
                }}
                socialProof={{
                    stat: "Used by over 2,000 professionals—including Fortune 500 teams—who doubled their income, impact, and inner clarity in just 5 days.",
                    testimonial: "I'm not the same person I was a week ago.",
                    author: "Misty R."
                }}
                microTestimonials={[
                    "I walked into my next meeting and the whole room followed my energy.",
                    "My nervous system finally feels like an asset, not a liability.",
                    "This rewired how I respond under pressure—in life and in business."
                ]}
            />

            {/* Globe Section - Global Community */}
            <section className="py-24 px-6 bg-black relative">
                <div className="max-w-7xl mx-auto w-full relative">
                    <SectionHeader
                        title={
                            <>
                                Join a Global <span className="text-primary">Revolution</span>
                            </>
                        }
                        subtitle="Thousands of leaders, entrepreneurs, and change-makers across six continents are transforming pressure into clarity. The collective is growing. Your place is waiting."
                    />
                    <div className="relative w-full h-[600px]">
                        <World data={sampleArcs} globeConfig={globeConfig} />
                    </div>
                </div>
            </section>

            {/* The Problem - Pain Points */}
            <ProblemPainPointsGrid
                title={
                    <>
                        The <span className="text-primary">Pressure</span> You&apos;re Under<br />Isn&apos;t the Problem
                    </>
                }
                subtitle={
                    <>
                        It&apos;s that your <span className="text-primary">nervous system</span> isn&apos;t trained for it
                    </>
                }
                painPoints={[
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
                ]}
                quote={{
                    text: (
                        <>
                            &ldquo;You can&apos;t <span className="text-primary not-italic">think</span> your way into a new identity.<br />
                            Your nervous system is running the show.<br />
                            That&apos;s why willpower fails.&rdquo;
                        </>
                    ),
                    author: "Michael T Dugan"
                }}
            />

            {/* The Solution - Diamond Operating System */}
            <section id="solution" className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <SectionHeader
                        title={
                            <>
                                Introducing the <span className="text-primary">Diamond Operating System</span>
                            </>
                        }
                        subtitle="A complete transformation system that rewires how you think, feel, and show up under pressure"
                    />

                    <BentoGrid className="mb-16">
                        <BentoGridItem
                            title="The Diamond Operating System"
                            description="Converts pressure into clarity, chaos into calm. You don't just react better—you lead better. You become the person people trust in crisis."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=800&h=400&fit=crop"
                                        alt="Meditation and consciousness"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>
                            }
                            className="md:col-span-2"
                        />
                        <BentoGridItem
                            title="Swiss Army Knife"
                            description="Real-time emotional regulation. Get back to center instantly, no matter what's happening. Body, Breath, Brain tools."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&h=400&fit=crop"
                                        alt="Centered presence"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>
                            }
                        />
                        <BentoGridItem
                            title="ART & ART² Protocols"
                            description="Clears emotional static and reclaims your power. Transform fear, anger, and doubt into intentional action."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&h=400&fit=crop"
                                        alt="Energy and transformation"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>
                            }
                        />
                        <BentoGridItem
                            title="The Diamond Sprint"
                            description="30-Day Practice that installs new habits and baseline identity. Build unshakable confidence through consistent action."
                            header={
                                <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&h=400&fit=crop"
                                        alt="Journey and elevation"
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>
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
            <TestimonialsSection
                title="What People Are Saying"
                subtitle="Real transformations from real people"
                testimonials={[
                    {
                        quote: "I'm not the same person I was a week ago. The Diamond Operating System gave me tools that actually work under real pressure.",
                        name: "Misty Rodriguez",
                        designation: "Sales Executive",
                        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "Michael gave me tools that actually work under real pressure. My entire nervous system feels upgraded.",
                        name: "Mark Thompson",
                        designation: "Corporate Leader",
                        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "My entire nervous system feels upgraded. I show up stronger in every meeting and relationship—without losing myself.",
                        name: "Fernando Garcia",
                        designation: "Entrepreneur",
                        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "Michael is a product of a lifetime in the forge. Becoming Diamond is now part of my daily practice.",
                        name: "Richard Hallett",
                        designation: "Psychologist & AI Engineer",
                        src: "/greece_profile2.jpeg"
                    }
                ]}
            />

            {/* Lead Magnet - Free Diamond Sprint */}
            <LeadMagnetSection
                badge="FREE DOWNLOAD"
                title={
                    <>
                        Turning <span className="text-primary">Pressure</span> Into Power
                    </>
                }
                subtitle="Get the Free Diamond Sprint + Manifesto"
                benefits={[
                    { text: "The Diamond Manifesto – Daily identity upgrade ritual" },
                    { text: "The 30-Day Diamond Sprint – Nervous system training tracker" },
                    { text: "Swiss Army Knife Reset Guide – Emotional regulation cheat sheet" }
                ]}
                bonusItem="BONUS Audio: &quot;The Boss: Who's Really Running Your Life?&quot;"
                ctaText="Yes, I Want the Free Diamond Sprint"
                disclaimer="Discover the 3 tools that helped thousands regulate stress, rewire identity, and lead through chaos—in just 15 minutes a day."
            />

            {/* Book Sales Section (Visible but Secondary) */}
            <BookSalesSection />

            {/* Programs Overview */}
            <section id="programs" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/20 to-black">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title={
                            <>
                                Choose Your Transformation Path
                            </>
                        }
                        subtitle="From a quick clarity reset to full-body reinvention—this is your pressure-proof path forward."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Tier 1: Diamond Advantage - $97 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 flex flex-col"
                        >
                            <div className="mb-4">
                                <div className="text-primary text-sm font-bold mb-2">TIER 1</div>
                                <h3 className="text-xl mb-2 font-bold">Diamond Advantage</h3>
                                <div className="text-2xl font-light mb-3 text-primary">$97</div>
                            </div>
                            <p className="text-sm text-gray-300 mb-4 flex-grow">
                                Feel Calm, Clear, and Centered—Even in Chaos
                            </p>
                            <ul className="space-y-2 mb-6 text-xs text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Master one simple practice to stay calm under pressure</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Build daily habits that create unshakable peace</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>30-day tracker + practice prompts</span>
                                </li>
                            </ul>
                            <Link href="/offers/diamond-advantage" className="mt-auto">
                                <button className="w-full bg-white/10 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                                    Access the Diamond Advantage
                                </button>
                            </Link>
                        </motion.div>

                        {/* Tier 2: Diamond Edge Mastery - $497 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/50 rounded-2xl p-6 flex flex-col relative"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black px-3 py-1 rounded-full text-xs font-bold">
                                MOST POPULAR
                            </div>
                            <div className="mb-4">
                                <div className="text-primary text-sm font-bold mb-2">TIER 2</div>
                                <h3 className="text-xl mb-2 font-bold">Diamond Edge Mastery</h3>
                                <div className="text-2xl font-light mb-3 text-primary">$497</div>
                            </div>
                            <p className="text-sm text-gray-300 mb-4 flex-grow">
                                Own the Room. Command Respect. Rise with Confidence.
                            </p>
                            <ul className="space-y-2 mb-6 text-xs text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Everything in Diamond Advantage</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>2 live experiential sessions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>1 immersive 5-hour Diamond Seminar</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Private community of high-achievers</span>
                                </li>
                            </ul>
                            <Link href="/offers/diamond-edge-mastery" className="mt-auto">
                                <button className="w-full bg-primary text-black py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
                                    Step Into Diamond Edge Mastery
                                </button>
                            </Link>
                        </motion.div>

                        {/* Tier 3: Pressure Room One - $1,997 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 flex flex-col"
                        >
                            <div className="mb-4">
                                <div className="text-primary text-sm font-bold mb-2">TIER 3</div>
                                <h3 className="text-xl mb-2 font-bold">Pressure Room One</h3>
                                <div className="text-2xl font-light mb-3 text-primary">$1,997</div>
                            </div>
                            <p className="text-sm text-gray-300 mb-4 flex-grow">
                                Step Into the Fire. Walk Out Unshakable.
                            </p>
                            <ul className="space-y-2 mb-6 text-xs text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Everything in Diamond Edge Mastery</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>3-day Pressure Room One experience</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Train under real-world tension</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Rewire your nervous system</span>
                                </li>
                            </ul>
                            <Link href="/offers/pressure-room-one" className="mt-auto">
                                <button className="w-full bg-white/10 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                                    Enter Pressure Room One
                                </button>
                            </Link>
                        </motion.div>

                        {/* Tier 4: DiamondMind Immersion - $7,995 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary rounded-2xl p-6 flex flex-col relative"
                        >
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-full text-xs font-bold">
                                ULTIMATE
                            </div>
                            <div className="mb-4">
                                <div className="text-primary text-sm font-bold mb-2">TIER 4</div>
                                <h3 className="text-xl mb-2 font-bold">DiamondMind Immersion</h3>
                                <div className="text-2xl font-light mb-3 text-primary">$7,995</div>
                            </div>
                            <p className="text-sm text-gray-300 mb-4 flex-grow leading-snug">
                                The Ultimate Transformation: Live Unshakable Every Day.
                            </p>
                            <ul className="space-y-2 mb-6 text-xs text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Everything in Pressure Room One</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>5x 3-day Pressure Room Intensives</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>5x 2-hour Integration Labs</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">→</span>
                                    <span>Yearlong transformation journey</span>
                                </li>
                            </ul>
                            <Link href="/collective" className="mt-auto">
                                <button className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                                    Begin Your DiamondMind Immersion
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
