"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FeatureGuard } from "@/components/FeatureGuard";
import {
    IconQuestionMark,
    IconBook,
    IconMail,
    IconBrandDiscord,
    IconSearch,
    IconChevronDown,
    IconChevronUp,
    IconHeadset
} from "@tabler/icons-react";

function SupportPageContent() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const faqs = [
        {
            question: "How do I access my course materials?",
            answer: "Navigate to the Courses page from the left sidebar. Click on any enrolled course to access lessons, videos, and downloadable resources."
        },
        {
            question: "What is the Diamond Operating System?",
            answer: "The Diamond Operating System is our comprehensive methodology for nervous system regulation and identity transformation. It teaches you to convert pressure into clarity and build unshakable presence."
        },
        {
            question: "How do the 5 Pressure Rooms work?",
            answer: "The 5 Pressure Rooms are progressive transformational stages: PR I (Stabilize), PR II (Shift), PR III (Strengthen), PR IV (Shine), and PR V (Synthesize). Each Pressure Room builds upon the previous one to create lasting change."
        },
        {
            question: "Can I change my subscription plan?",
            answer: "Yes! Go to Settings > Billing to view available plans and make changes. Contact support if you need assistance choosing the right plan."
        },
        {
            question: "How do I contact Michael directly?",
            answer: "VIP tier members have direct Voxer access. Full Program members can connect during live coaching calls. Otherwise, reach out through our community forum or support channels."
        },
        {
            question: "What if I miss a live session?",
            answer: "All live sessions are recorded and available in your course library within 24 hours. You'll receive an email notification when recordings are ready."
        }
    ];

    const resources = [
        {
            title: "Getting Started Guide",
            description: "New to Becoming Diamond? Start here for a comprehensive overview.",
            icon: IconBook,
            color: "text-blue-400"
        },
        {
            title: "Knowledge Base",
            description: "Browse articles and tutorials about the Diamond methodology.",
            icon: IconQuestionMark,
            color: "text-purple-400"
        },
        {
            title: "Community Forum",
            description: "Connect with other members and share your transformation journey.",
            icon: IconBrandDiscord,
            color: "text-green-400"
        },
        {
            title: "Live Support",
            description: "Chat with our support team Monday-Friday, 9am-5pm PST.",
            icon: IconHeadset,
            color: "text-orange-400"
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-light mb-2">
                    <span className="text-primary">Support</span>
                </h1>
                <p className="text-gray-400">Get help and explore resources</p>
            </div>

            {/* Quick Resources */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
                {resources.map((resource, index) => (
                    <div
                        key={index}
                        className="bg-secondary/30 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all cursor-pointer"
                    >
                        <resource.icon className={`w-10 h-10 ${resource.color} mb-4`} />
                        <h3 className="text-lg font-light mb-2">{resource.title}</h3>
                        <p className="text-sm text-gray-400">{resource.description}</p>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-light mb-6">Frequently Asked Questions</h2>

                {/* Search */}
                <div className="relative mb-6">
                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search FAQs..."
                        className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-secondary/30 border border-white/10 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="text-white font-light">{faq.question}</span>
                                {expandedFaq === index ? (
                                    <IconChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                                ) : (
                                    <IconChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            {expandedFaq === index && (
                                <div className="px-5 pb-5">
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            No results found. Try a different search term.
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-8">
                <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
                    <IconMail className="w-6 h-6 text-primary" />
                    Contact Support
                </h2>

                <p className="text-gray-300 mb-6">
                    Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you within 24 hours.
                </p>

                <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="support-name" className="text-gray-300">Name</Label>
                            <Input id="support-name" placeholder="Your name" className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="support-email" className="text-gray-300">Email</Label>
                            <Input id="support-email" type="email" placeholder="your.email@example.com" className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="support-subject" className="text-gray-300">Subject</Label>
                        <Input id="support-subject" placeholder="How can we help?" className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="support-message" className="text-gray-300">Message</Label>
                        <textarea
                            id="support-message"
                            rows={5}
                            placeholder="Describe your question or issue..."
                            className="w-full mt-2 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-primary text-black px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all"
                    >
                        Send Message
                    </button>
                </form>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-white/10 grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-light text-gray-400 mb-2">Email</h4>
                        <a href="mailto:support@becomingdiamond.com" className="text-white hover:text-primary transition-colors">
                            support@becomingdiamond.com
                        </a>
                    </div>
                    <div>
                        <h4 className="text-sm font-light text-gray-400 mb-2">Support Hours</h4>
                        <p className="text-white">Monday - Friday, 9:00 AM - 5:00 PM PST</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SupportPage() {
    return (
        <FeatureGuard>
            <SupportPageContent />
        </FeatureGuard>
    );
}
