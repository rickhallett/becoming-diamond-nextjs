"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-sm py-4" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-xl font-thin tracking-wider">
                    BECOMING DIAMOND
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link href="/book" className="hover:text-primary transition-colors">
                        Book
                    </Link>
                    <Link href="/program" className="hover:text-primary transition-colors">
                        Program
                    </Link>
                    <Link href="/collective" className="hover:text-primary transition-colors">
                        Collective
                    </Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">
                        Blog
                    </Link>
                    <Link href="/auth/signin" className="hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:drop-shadow-[0_0_12px_rgba(79,195,247,0.8)]">
                        Members Area
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={{
                    height: mobileMenuOpen ? 'auto' : 0,
                    opacity: mobileMenuOpen ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-black/95 backdrop-blur-sm"
            >
                <div className="px-6 py-6 flex flex-col gap-4">
                    <Link
                        href="/book"
                        className="text-lg hover:text-primary transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Book
                    </Link>
                    <Link
                        href="/program"
                        className="text-lg hover:text-primary transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Program
                    </Link>
                    <Link
                        href="/collective"
                        className="text-lg hover:text-primary transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Collective
                    </Link>
                    <Link
                        href="/blog"
                        className="text-lg hover:text-primary transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/auth/signin"
                        className="text-lg hover:text-primary transition-colors py-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] hover:drop-shadow-[0_0_12px_rgba(79,195,247,0.8)]"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Members Area
                    </Link>
                </div>
            </motion.div>
        </nav>
    );
}
