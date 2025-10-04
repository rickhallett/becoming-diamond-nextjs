"use client";
import { useState, useRef, useEffect } from "react";
import { IconSend, IconBrain, IconUser, IconSparkles, IconPlus, IconTrash, IconMenu2, IconX } from "@tabler/icons-react";
import { useChat } from "@/contexts/ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import { MarkdownMessage } from "@/components/MarkdownMessage";

export default function ChatPage() {
    const { currentSession, sessions, addMessage, createSession, loadSession, deleteSession, isLoading } = useChat();
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const [displayedMessage, setDisplayedMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const bufferRef = useRef<string>("");
    const animationFrameRef = useRef<number | null>(null);
    const lastUpdateRef = useRef<number>(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentSession?.messages, displayedMessage]);

    // Smooth typewriter effect with optimized rendering
    useEffect(() => {
        if (!streamingMessage) {
            setDisplayedMessage("");
            bufferRef.current = "";
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        // Update buffer with new content
        bufferRef.current = streamingMessage;

        // Typewriter animation using requestAnimationFrame
        const CHARS_PER_FRAME = 2; // Show 2 characters per frame for smooth appearance
        const MIN_FRAME_DELAY = 16; // ~60fps cap

        const animate = (timestamp: number) => {
            const elapsed = timestamp - lastUpdateRef.current;

            if (elapsed >= MIN_FRAME_DELAY) {
                setDisplayedMessage((prev) => {
                    if (prev.length >= bufferRef.current.length) {
                        return bufferRef.current;
                    }

                    // Add characters smoothly
                    const nextLength = Math.min(
                        prev.length + CHARS_PER_FRAME,
                        bufferRef.current.length
                    );
                    return bufferRef.current.slice(0, nextLength);
                });

                lastUpdateRef.current = timestamp;
            }

            // Continue animation if there's more content to show
            if (displayedMessage.length < bufferRef.current.length) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [streamingMessage, displayedMessage.length]);

    // Create a session if none exists
    useEffect(() => {
        if (!isLoading && !currentSession && sessions.length === 0) {
            createSession();
        }
    }, [isLoading, currentSession, sessions.length, createSession]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !currentSession) return;

        const question = inputValue;

        // Add user message
        addMessage(question, 'user');
        setInputValue("");
        setIsTyping(true);
        setStreamingMessage("");

        try {
            // Call the RAG API endpoint
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            // Read the streaming response and update incrementally
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    fullResponse += chunk;
                    setStreamingMessage(fullResponse);
                }
            }

            // Save the complete message
            addMessage(fullResponse, 'assistant');
            setStreamingMessage("");
            setIsTyping(false);
        } catch (error) {
            console.error('Error getting response:', error);
            const errorMsg = "I apologize, but I'm having trouble accessing the book content right now. Please make sure your ANTHROPIC_API_KEY is set in the environment variables.";
            addMessage(errorMsg, 'assistant');
            setStreamingMessage("");
            setIsTyping(false);
        }
    };

    const handleNewChat = () => {
        createSession();
        setIsSidebarOpen(false);
    };

    const handleLoadSession = (sessionId: string) => {
        loadSession(sessionId);
        setIsSidebarOpen(false);
    };

    const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this conversation?')) {
            deleteSession(sessionId);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else {
            return 'Just now';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-400">Loading chat...</div>
            </div>
        );
    }

    // Welcome message for first session
    const displayMessages = currentSession?.messages?.length === 0 ? [
        {
            id: 'welcome',
            role: 'assistant' as const,
            content: "Welcome! I'm DiamondMindAI, your guide to 'Turning Snowflakes into Diamonds' by Michael Dugan. I can answer questions about identity transformation, nervous system regulation, high-performance under pressure, and the methodologies taught in the book. What would you like to explore?",
            timestamp: new Date().toISOString()
        }
    ] : currentSession?.messages || [];

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex gap-6">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-24 right-6 z-50 w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all"
            >
                {isSidebarOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
            </button>

            {/* Sidebar - Sessions List */}
            <AnimatePresence>
                {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="fixed lg:relative inset-y-0 left-0 z-40 lg:z-0 w-80 bg-secondary/30 border border-white/10 rounded-xl p-4 overflow-y-auto lg:block"
                        style={{ height: 'calc(100vh - 12rem)' }}
                    >
                        {/* New Chat Button */}
                        <button
                            onClick={handleNewChat}
                            className="w-full mb-4 bg-primary/20 border border-primary/50 text-primary px-4 py-3 rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
                        >
                            <IconPlus className="w-5 h-5" />
                            <span>New Conversation</span>
                        </button>

                        {/* Sessions List */}
                        <div className="space-y-2">
                            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Conversations</h3>
                            {sessions.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-8">No conversations yet</p>
                            ) : (
                                sessions
                                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                    .map((session) => (
                                        <div
                                            key={session.id}
                                            onClick={() => handleLoadSession(session.id)}
                                            className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                                                currentSession?.id === session.id
                                                    ? 'bg-primary/20 border border-primary/50'
                                                    : 'bg-white/5 border border-white/10 hover:border-primary/30'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm truncate">{session.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatTimestamp(session.updatedAt)} · {session.messages.length} messages
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                                                >
                                                    <IconTrash className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
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
                            <p className="text-gray-400 text-sm">Ask me anything about &ldquo;Turning Snowflakes into Diamonds&rdquo;</p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto bg-secondary/20 border border-white/10 rounded-xl p-6 mb-6 space-y-6">
                    {displayMessages.map((message) => (
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
                                    {message.role === "assistant" ? (
                                        <div className="text-sm md:text-base prose prose-invert max-w-none">
                                            <MarkdownMessage content={message.content} />
                                        </div>
                                    ) : (
                                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Streaming Message */}
                    {isTyping && displayedMessage && (
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                                    <IconSparkles className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1 max-w-2xl">
                                <div className="inline-block px-4 py-3 rounded-lg bg-secondary/50 border border-white/10">
                                    <div className="text-sm md:text-base prose prose-invert max-w-none">
                                        <MarkdownMessage content={displayedMessage} />
                                        {/* Blinking cursor while typing */}
                                        {displayedMessage.length < bufferRef.current.length && (
                                            <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-pulse" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Typing Indicator (when no content yet) */}
                    {isTyping && !displayedMessage && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                                <IconSparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-secondary/50 border border-white/10 px-4 py-3 rounded-lg">
                                <div className="flex gap-1">
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                        className="w-2 h-2 bg-primary/60 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                        className="w-2 h-2 bg-primary/60 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                        className="w-2 h-2 bg-primary/60 rounded-full"
                                    />
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
                            placeholder="Ask a question about the book..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !inputValue.trim() || !currentSession}
                            className="bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <IconSend className="w-5 h-5" />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </form>

                    {/* Suggested Prompts */}
                    {displayMessages.length <= 1 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {[
                                "What is the Diamond Transformation Roadmap?",
                                "Explain snowflakes vs diamonds",
                                "How do I stabilize under pressure?",
                                "What makes humans irreplaceable in the AI age?"
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
                    )}
                </div>
            </div>
        </div>
    );
}
