"use client";
import { motion } from "framer-motion";
import { ReactNode, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!consent) {
            setStatus('error');
            setMessage('Please agree to receive emails to continue.');
            return;
        }

        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    consentGiven: consent
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
                setConsent(false);

                // Call optional onSubmit callback
                if (onSubmit) {
                    onSubmit(email);
                }

                // Redirect to book page after 2 seconds
                setTimeout(() => {
                    router.push('/book?from=lead-capture');
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please check your connection.');
        } finally {
            setLoading(false);
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                                className="w-full px-6 py-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                            />

                            <label className="flex items-start gap-3 text-left text-sm text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    disabled={loading}
                                    className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer disabled:opacity-50"
                                />
                                <span>
                                    I agree to receive the free Diamond Sprint materials and occasional updates via email.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading || !consent}
                                className="w-full bg-primary text-black px-8 py-4 text-lg font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : ctaText}
                            </button>

                            {status === 'success' && (
                                <div className="text-green-400 text-sm text-center bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                                    {message}
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                                    {message}
                                </div>
                            )}
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
