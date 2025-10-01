"use client";
import { useState, useRef, useEffect } from "react";
import { IconSend, IconBrain, IconUser, IconSparkles } from "@tabler/icons-react";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content: "Welcome! I'm DiamondMindAI, your transformation companion. I'm here to help you navigate your journey through the Diamond Operating System. How can I support you today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: messages.length + 2,
                role: "assistant",
                content: generateResponse(inputValue),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes("gateway") || lowerQuery.includes("program")) {
            return "The Diamond Collective features 5 transformational gateways: Stabilize, Shift, Strengthen, Shine, and Synthesize. Each gateway builds upon the previous, creating a comprehensive system for nervous system mastery and identity transformation. Would you like to learn more about a specific gateway?";
        }

        if (lowerQuery.includes("nervous system") || lowerQuery.includes("regulation")) {
            return "Nervous system regulation is the foundation of the Diamond Operating System. We teach you real-time techniques to move from dysregulation to coherence, using the Swiss Army Knife protocols: Body, Breath, and Brain tools. These aren't theory—they're embodied practices you can use in high-pressure moments.";
        }

        if (lowerQuery.includes("pressure") || lowerQuery.includes("stress")) {
            return "Pressure isn't the problem—it's how your nervous system responds to it. The Diamond methodology trains you to convert pressure into clarity and chaos into calm. You learn to stay grounded when everything around you is unstable. This is what separates leaders who thrive from those who merely survive.";
        }

        return "That's a great question. The Diamond Operating System is designed to help you master presence under pressure, rewire limiting identities, and build unshakable resilience. What specific aspect of your transformation would you like to explore?";
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                            <IconBrain className="w-7 h-7 text-primary" />
                        </div>
                        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-light">
                            Diamond<span className="text-primary">Mind</span>AI
                        </h1>
                        <p className="text-gray-400 text-sm">Your transformation companion</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto bg-secondary/20 border border-white/10 rounded-xl p-6 mb-6 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {message.role === "assistant" ? (
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                                    <IconSparkles className="w-5 h-5 text-primary" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                                    <IconUser className="w-5 h-5 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Message Content */}
                        <div className={`flex-1 max-w-2xl ${message.role === "user" ? "text-right" : ""}`}>
                            <div
                                className={`inline-block px-4 py-3 rounded-lg ${
                                    message.role === "assistant"
                                        ? "bg-secondary/50 border border-white/10"
                                        : "bg-primary/20 border border-primary/30"
                                }`}
                            >
                                <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                            <IconSparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="bg-secondary/50 border border-white/10 px-4 py-3 rounded-lg">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-primary/60 rounded-full" />
                                <div className="w-2 h-2 bg-primary/60 rounded-full" />
                                <div className="w-2 h-2 bg-primary/60 rounded-full" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-secondary/30 border border-white/10 rounded-xl p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about your transformation journey..."
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={isTyping || !inputValue.trim()}
                        className="bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <IconSend className="w-5 h-5" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>

                {/* Suggested Prompts */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {[
                        "What are the 5 Gateways?",
                        "How do I regulate my nervous system?",
                        "Tell me about Gateway 1",
                        "What is the Swiss Army Knife?"
                    ].map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => setInputValue(prompt)}
                            className="text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-primary/30 hover:bg-white/10 transition-all"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
