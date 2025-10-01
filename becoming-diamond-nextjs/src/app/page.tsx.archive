/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SparklesBackground } from "../components/ui/sparkles-background";

export default function Home() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="bg-black min-h-screen text-white">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-sm py-4" : "bg-transparent py-6"
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="text-xl font-thin tracking-wider">
                        TNITD
                    </Link>
                    <div className="flex gap-8">
                        <Link href="#about" className="hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="#book" className="hover:text-primary transition-colors">
                            Book
                        </Link>
                        <Link href="#buy" className="hover:text-primary transition-colors">
                            Buy
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="h-screen flex items-center justify-center relative overflow-hidden">
                {/* Sparkles background */}
                <SparklesBackground />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-[1]" />

                {/* Animated background effect */}
                <div className="absolute inset-0 z-[2]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                </div>

                <motion.div
                    className="relative z-10 text-center px-6 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
                >
                    <h1 className="mb-8 leading-none">
                        The <span className="text-primary">Future</span> is Here.<br />
                        <span className="text-primary">Are You Ready to Survive It?</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-light text-gray-300 mb-12 max-w-3xl mx-auto">
                        In an age of <span className="text-primary">AI and constant disruption</span>, your resilience is your most valuable asset.
                        This is your guide to not just surviving, but <span className="text-primary">thriving</span> in the face of pressure.
                        This is how you turn <span className="font-normal">snowflakes into diamonds</span>.
                    </p>

                    <motion.button
                        className="bg-primary text-black px-8 py-4 text-lg font-medium hover:bg-primary/90 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('premise')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Start Your Transformation
                    </motion.button>
                </motion.div>
            </section>

            {/* The Premise Section */}
            <section id="premise" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className="mb-12">From Snowflake to <span className="text-primary">Diamond</span>: The Choice is Yours</h2>

                        <div className="space-y-6 text-gray-300">
                            <p className="text-lg leading-relaxed">
                                Most of us were unconsciously trained to be <span className="italic">snowflakes</span>: beautiful, unique, and gone the moment the temperature rises.
                                We were told to get the right credentials, keep our heads down, and we'd be safe. <span className="text-primary font-medium">That script is gone.</span>
                            </p>

                            <p className="text-lg leading-relaxed">
                                In the AI age, your resume won't be your safety net. <span className="text-primary font-medium">Your adaptability will be.</span>
                            </p>

                            <p className="text-lg leading-relaxed font-light italic">
                                <span className="font-normal not-italic">Turning Snowflakes into Diamonds</span> is not just a book; it's a <span className="text-primary not-italic">field manual</span> for the future of work—and the future of you.
                                It provides a practical, repeatable system for turning <span className="text-primary">pressure into power</span>, <span className="text-primary">uncertainty into clarity</span>, and <span className="text-primary">disruption into opportunity</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Marketing Hooks Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-black via-secondary/50 to-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Master Your Inner State",
                                subtitle: "Lead from Within",
                                description: "Before you can lead in the world, you must lead yourself. Learn to regulate your nervous system, master your emotions, and operate from a place of unshakeable presence, no matter the external chaos."
                            },
                            {
                                title: "Become Indispensable",
                                subtitle: "The Diamond Response",
                                description: "While AI can replicate skills, it cannot replicate your presence, clarity, and intent. Discover how to cultivate the uniquely human qualities that make you irreplaceable in a world of automation."
                            },
                            {
                                title: "A Practical Roadmap",
                                subtitle: "The Diamond Transformation Roadmap",
                                description: "This isn't theory; it's a practical, repeatable system. Through the four stages—Stabilize, Shift, Strengthen, and Shine—you will build the emotional and energetic resilience to thrive in a world where change is the only constant."
                            }
                        ].map((hook, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <div className="mb-6 h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-full bg-primary/20" />
                                </div>
                                <h3 className="text-2xl font-light mb-2">{hook.title}</h3>
                                <h4 className="text-primary mb-4">{hook.subtitle}</h4>
                                <p className="text-gray-400">{hook.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Book Breakdown Section */}
            <section id="book" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        The <span className="text-primary">Diamond Transformation</span> Roadmap
                    </motion.h2>

                    <div className="space-y-16">
                        {[
                            {
                                part: "Part 1",
                                title: "Facing the Shift",
                                description: "This is your <span class='text-primary'>wake-up call</span>. It&apos;s about seeing the disruption of the AI era clearly, naming it, and understanding that the real threat isn't just losing your job, but <span class='text-primary'>losing your identity</span> with it.",
                                quote: "Most people think the robots are coming. I'm here to tell you — they're already here."
                            },
                            {
                                part: "Part 2",
                                title: "The Shift",
                                description: "This is where you build your <span class='text-primary'>operating system for resilience</span>. You'll learn the ACE LIFE framework to make presence, identity, and adaptability your <span class='text-primary'>default state</span>.",
                                quote: "When you walk into The Pressure Room, you don't rise to the level of your goals. You fall to the level of your baseline frequency."
                            },
                            {
                                part: "Part 3",
                                title: "Strengthen",
                                description: "A strong inner game requires <span class='text-primary'>outer application</span>. Learn to apply your new operating system in real-world scenarios: navigating AI-driven career shifts and leading <span class='text-primary'>hybrid human-AI teams</span>.",
                                quote: "Your inner tools are what make you ready. Your outer actions are what make you relevant."
                            },
                            {
                                part: "Part 4",
                                title: "Shine",
                                description: "Integration and making the <span class='text-primary'>Diamond Operating System</span> a natural part of how you live and lead. Move from conscious effort to <span class='text-primary'>unconscious competence</span>.",
                                quote: "Pressure doesn't build character, it reveals it. Your daily practices don't invent your identity—they reveal and reinforce the Diamond Identity you've already chosen."
                            }
                        ].map((section, index) => (
                            <motion.div
                                key={index}
                                className="grid md:grid-cols-2 gap-8 items-center"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                                    <h3 className="text-primary mb-2">{section.part}</h3>
                                    <h4 className="text-3xl mb-4">{section.title}</h4>
                                    <p className="text-gray-400 mb-6" dangerouslySetInnerHTML={{ __html: section.description }} />
                                    <blockquote className="border-l-2 border-primary pl-4 italic text-gray-300">
                                        "{section.quote}"
                                    </blockquote>
                                </div>
                                <div className={`h-64 bg-gradient-to-br from-primary/5 to-primary/20 rounded-lg ${index % 2 === 1 ? "md:order-1" : ""
                                    }`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quotes Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="space-y-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {[
                            { text: "The truth is, we're standing at the edge of the ", highlight: "fastest wave of change", rest: " in human history. It&apos;s not just the headlines about AI, robotics, or quantum computing. It&apos;s the way these technologies are weaving into daily life—changing how we work, connect, and even define ourselves." },
                            { text: "Diamonds don't resist pressure; ", highlight: "they're formed by it", rest: ". They emerge clearer, stronger, and more valuable than before. This book is about building that response—not in theory, but in the wiring of your nervous system, the structure of your identity, and the way you meet every challenge from this day forward." },
                            { text: "In the AI era, your voice still matters—but it's not enough to just be heard. ", highlight: "You have to be understood", rest: ", across every channel, by both humans and machines." }
                        ].map((quote, index) => (
                            <motion.blockquote
                                key={index}
                                className="relative text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                <div className="text-6xl text-primary/20 absolute -top-4 left-0">"</div>
                                <p className="text-xl md:text-2xl font-light italic text-gray-300 relative z-10 px-8">
                                    {quote.text}
                                    <span className="text-primary">{quote.highlight}</span>
                                    {quote.rest}
                                </p>
                                <div className="text-6xl text-primary/20 absolute -bottom-4 right-0 rotate-180">"</div>
                            </motion.blockquote>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Author Section */}
            <section id="about" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className="mb-12">About <span className="text-primary">Michael Dugan</span></h2>

                        <div className="space-y-6 text-gray-300">
                            <p className="text-lg leading-relaxed">
                                Michael Dugan has invested more than <span className="text-primary font-medium">20,000 hours</span> helping people perform—and thrive—under pressure.
                                From the construction sites of Alaska to high-stakes corporate training rooms, he has worked with thousands
                                of professionals to stay steady in the heat, <span className="text-primary">lead with presence</span>, and adapt faster than the world around them.
                            </p>

                            <p className="text-lg leading-relaxed">
                                His approach blends <span className="text-primary">practical neuroscience</span>, <span className="text-primary">emotional mastery</span>, and <span className="text-primary">lived experience</span>. These aren't theories—they're
                                tools tested in real workplaces with real people, where performance and adaptability weren't optional but required.
                            </p>

                            <p className="text-lg leading-relaxed">
                                Michael knows what it means to be tested. He has faced setbacks, personal challenges, and moments of intense
                                pressure—and each time, he came back stronger, not by avoiding the heat but by <span className="text-primary font-medium">learning how to use it</span>.
                                That resilience shaped the <span className="text-primary">Diamond Operating System</span>, the framework at the heart of his work.
                            </p>

                            <p className="text-lg leading-relaxed">
                                For Michael, pressure isn't the enemy. It&apos;s the test that reveals strength. And in that test, <span className="text-primary font-medium">anyone can become a Diamond</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Buy Section */}
            <section id="buy" className="py-24 px-6 bg-gradient-to-t from-black via-secondary/50 to-black">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className="mb-8">Get Your Digital Copy</h2>

                        <p className="text-xl text-gray-300 mb-12">
                            The future won't wait. Your transformation starts now. Get the complete guide to
                            becoming unshakable in the age of AI and disruption.
                        </p>

                        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg p-8 mb-8">
                            <h3 className="text-2xl mb-6">What You'll Get</h3>
                            <ul className="text-left max-w-2xl mx-auto space-y-3 text-gray-300 mb-8">
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">✓</span>
                                    <span>The full digital version of Turning Snowflakes into Diamonds in PDF format</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">✓</span>
                                    <span>Actionable frameworks and practical exercises to build your resilience</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">✓</span>
                                    <span>A new operating system for thriving in a world of constant change</span>
                                </li>
                            </ul>

                            <div className="text-4xl font-light mb-6">$14.99</div>

                            <motion.button
                                className="bg-primary text-black px-8 py-4 text-lg font-medium hover:bg-primary/90 transition-all mb-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Buy Now with Stripe
                            </motion.button>

                            <p className="text-sm text-gray-500">Secure payment processing</p>
                        </div>

                        <div className="text-gray-400">
                            <p className="mb-4">Also available on Amazon</p>
                            <motion.button
                                className="border border-gray-600 text-white px-6 py-3 hover:bg-white/10 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View on Amazon
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto text-center text-gray-500">
                    <p>&copy; 2025 Michael Dugan. All rights reserved.</p>
                    <p className="mt-2">Turning Snowflakes into Diamonds</p>
                </div>
            </footer>
        </main>
    );
}
