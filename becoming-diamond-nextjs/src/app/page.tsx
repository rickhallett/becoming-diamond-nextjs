/* eslint-disable react/no-unescaped-entities */
"use client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ProblemPainPointsGrid } from "@/components/ProblemPainPointsGrid";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { BookSalesSection } from "@/components/BookSalesSection";
import { GlobalCommunitySection } from "@/components/landing/global-community-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { ProgramsSection } from "@/components/landing/programs-section";

export default function LandingPage() {
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
            <GlobalCommunitySection />

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
            <SolutionSection />

            {/* Social Proof - Testimonials */}
            <TestimonialsSection
                title="What People Are Saying"
                subtitle="Real transformations from real people"
                testimonials={[
                    {
                        quote: "This isn’t about products. It’s about presence. The clarity, the energy, the tools—they stay with you long after the class ends.",
                        name: "James M.",
                        designation: "Entrepreneur",
                        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop"
                    },
                    {
                        quote: "This wasn’t just motivation. It was a transformation from the inside out.",
                        name: "Misty U.",
                        designation: "Finance Professional",
                        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=600&fit=crop"
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
                        src: "/profile-placeholder.webp"
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
                subtitle="Get the Free Diamond Sprint + Manifesto (Instant PDF Delivery)"
                benefits={[
                    { text: "The Diamond Manifesto PDF – Your philosophical foundation (sent instantly via email)" },
                    { text: "The 30-Day Diamond Sprint – Complete nervous system training program" },
                    { text: "Swiss Army Knife Reset Guide – Emotional regulation cheat sheet" }
                ]}
                bonusItem="BONUS Audio: &quot;The Boss: Who's Really Running Your Life?&quot;"
                ctaText="Send Me the Manifesto + Sprint Materials"
                disclaimer="Discover the 3 tools that helped thousands regulate stress, rewire identity, and lead through chaos—in just 15 minutes a day."
            />

            {/* Book Sales Section (Visible but Secondary) */}
            <BookSalesSection />

            {/* Programs Overview */}
            <ProgramsSection />

            <Footer />
        </main>
    );
}
