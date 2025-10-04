/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ProblemPainPointsGrid } from "@/components/ProblemPainPointsGrid";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { BookSalesSection } from "@/components/BookSalesSection";
import { SectionHeader } from "@/components/SectionHeader";
import { IconCheck } from "@tabler/icons-react";

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
                    stat: "Professionals trained in this system earned 23% more revenue than those who weren’t. The difference? Presence under pressure.",
                    testimonial: "I'm not the same person I was a week ago. This wasn’t just motivation. It was a transformation from the inside out",
                    author: "Misty U."
                }}
                microTestimonials={[
                    "Michael didn’t just teach us how to perform—he showed us how to become.” — Connor, Training Attendee",
                    "Since Michael’s class, my averages jumped from $900 to $1,800. More importantly, I love who I’ve become.”— Mark, Finance Manager",
                    "This was bigger than sales. This was soul work.” — Fabian, Sales Professional"
                ]}
            />

            {/* Globe Section - Global Community */}
            <section className="py-24 px-6 bg-black relative">
                <div className="max-w-7xl mx-auto w-full relative">
                    <SectionHeader
                        title={
                            <>
                                Join a Diamond Mind <span className="text-primary">Global Movement</span>
                            </>
                        }
                        subtitle="Thousands of leaders, entrepreneurs, and change-makers across six continents are turning pressure into clarity. The movement is growing. Your place is waiting."
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
                            When you choose and embody your identity, you stop living by default—and start living by design.
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
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
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
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
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
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
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
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
                        </motion.div>
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
                        quote: "This isn’t about products. It’s about presence. The clarity, the energy, the tools—they stay with you long after the class ends.",
                        name: "James M.",
                        designation: "Entrepreneur",
                        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "This wasn’t just motivation. It was a transformation from the inside out.",
                        name: "Misty U.",
                        designation: "Finance Professional",
                        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "Michael’s training gave me my confidence back—not just at work, but in life. This was bigger than sales. This was soul work.",
                        name: "Fernando Garcia",
                        designation: "Entrepreneur",
                        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "Michael is a product of a lifetime in the forge. The essence of Becoming Diamond is part of my daily practice.",
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
            <section id="programs" className="py-24 px-6 bg-gradient-to-b from-black via-primary/5 to-black">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title={
                            <>
                                Choose Your <span className="text-primary">Transformation Path</span>
                            </>
                        }
                        subtitle="From self-paced courses to yearlong coaching—find the right fit for your journey"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Diamond Activation Experience Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0 }}
                            viewport={{ once: true }}
                        >
                            <CardSpotlight
                                className="h-full w-full"
                                color="rgba(79, 195, 247, 0.15)"
                            >
                                <div className="relative z-20 h-full flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                            Diamond Activation Experience
                                        </h3>
                                        <p className="text-lg text-primary font-light mb-4">
                                            A three-tier transformational path to reset your nervous system, rewire your identity, and lead with presence under pressure.
                                        </p>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Complete online transformation program with three tiers: self-paced ($97), full program with coaching ($497), and premium 1-on-1 mentoring $2997.
                                        </p>
                                    </div>

                                    <div className="mb-8 flex-grow">
                                        <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
                                            What&apos;s Included
                                        </h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">Full Diamond Operating System Course</span>
                                            </li>
                                            <li className="flex items-start">
                                                <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">Swiss Army Knife Toolkit</span>
                                            </li>
                                            <li className="flex items-start">
                                                <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">Live Coaching & Community (Full/Premium tiers)</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href="/program"
                                            className="block w-full text-center bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors border border-white/20 rounded-lg px-6 py-3"
                                        >
                                            View Program Details
                                        </Link>
                                    </div>
                                </div>
                            </CardSpotlight>
                        </motion.div>

                        {/* DiamondMind Collective Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <CardSpotlight
                                className="h-full w-full border-primary/40"
                                color="rgba(79, 195, 247, 0.2)"
                            >
                                <div className="relative z-20 h-full flex flex-col">
                                    {/* Premium Badge */}
                                    <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary to-primary/70 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-primary/50 uppercase tracking-wider">
                                        Premium
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                            DiamondMind Collective
                                        </h3>
                                        <p className="text-base text-gray-300 leading-relaxed">
                                            A yearlong transformational journey through five high-intensity Pressure Rooms—for those ready to stop reacting and start leading from within. Enrollment is capped at 100 per immersive experience.
                                        </p>
                                    </div>

                                    <div className="mb-8 flex-grow">
                                        <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
                                            What&apos;s Included
                                        </h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">12-month guided journey</span>
                                            </li>
                                            <li className="flex items-start">
                                                <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">5 transformational Pressure Rooms</span>
                                            </li>
                                            <li className="flex items-start">
                                                <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">DiamondMindAI support</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href="/collective"
                                            className="block w-full text-center bg-primary/10 backdrop-blur-sm hover:bg-primary/20 transition-colors border border-primary/50 rounded-lg px-6 py-3"
                                        >
                                            Explore the Collective
                                        </Link>
                                    </div>
                                </div>
                            </CardSpotlight>
                        </motion.div>
                    </div>

                    {/* Bottom Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <p className="text-gray-400 text-sm md:text-base italic">
                            Not sure which path is right for you?{" "}
                            <button
                                onClick={() => document.getElementById('lead-magnet')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-primary hover:underline focus:outline-none"
                            >
                                Start with the free Diamond Sprint
                            </button>
                            {" "}to experience the foundation.
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
