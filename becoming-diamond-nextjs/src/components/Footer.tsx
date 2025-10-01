import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center">
                    <p className="text-base md:text-lg lg:text-xl text-gray-300 font-light relative inline-block px-4">
                        <span className="relative">
                            You weren&apos;t born to melt under pressure. You were born to become a{" "}
                            <span className="text-primary font-normal drop-shadow-[0_0_15px_rgba(79,195,247,0.5)]">Diamond</span>.
                        </span>
                    </p>
                    <p className="mt-3 md:mt-4 text-sm text-gray-400 italic">
                        — Michael T Dugan
                    </p>
                    <p className="mt-4 md:mt-6 text-xs text-gray-600">&copy; 2025 Becoming Diamond. All rights reserved.</p>
                </div>
            </div>

            {/* Oceanheart Badge - Bottom Right Corner */}
            <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1 z-20">
                <img
                    src="/0.png"
                    alt="Oceanheart AI"
                    className="w-10 h-10 opacity-60"
                />
                <p className="text-xs text-gray-600 text-center">
                    Built with love by
                </p>
                <Link
                    href="https://www.oceanheart.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-primary transition-all hover:drop-shadow-[0_0_8px_rgba(79,195,247,0.6)]"
                >
                    www.oceanheart.ai
                </Link>
            </div>
        </footer>
    );
}
