"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    IconHome,
    IconBooks,
    IconBrain,
    IconUser,
    IconSettings,
    IconHelp,
    IconMenu2,
    IconX,
    IconSparkles,
    IconRocket
} from "@tabler/icons-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { FEATURES } from "@/config/features";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session } = useSession();

    // Define all possible navigation items
    const allNavItems = [
        { name: "Dashboard", href: "/app", icon: IconHome, feature: 'dashboard' as const },
        { name: "30 Day Sprint", href: "/app/sprint", icon: IconRocket, feature: null },
        { name: "Courses", href: "/app/courses", icon: IconBooks, feature: 'courses' as const },
        { name: "DiamondMindAI", href: "/app/chat", icon: IconBrain, feature: 'diamondMindAI' as const },
        { name: "Profile", href: "/app/profile", icon: IconUser, feature: null },
        { name: "Settings", href: "/app/settings", icon: IconSettings, feature: 'settings' as const },
        { name: "Support", href: "/app/support", icon: IconHelp, feature: 'support' as const },
    ];

    // Filter navigation items based on feature flags
    const navItems = allNavItems.filter(item => {
        // If no feature flag is set, always show the item
        if (item.feature === null) return true;
        // Otherwise, check if the feature is enabled
        return FEATURES[item.feature];
    });

    const isActive = (href: string) => {
        if (href === "/app") {
            return pathname === "/app";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-gradient-to-b from-secondary/50 to-black border-r border-white/10 fixed h-full z-40">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <Link href="/app" className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                                <IconSparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
                        </div>
                        <div>
                            <h1 className="text-lg font-light tracking-wide">
                                BECOMING <span className="text-primary font-normal">DIAMOND</span>
                            </h1>
                            <p className="text-xs text-gray-500">Member Portal</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {active && (
                                        <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                                    )}
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-light">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section & Logout */}
                <div className="p-4 border-t border-white/10 space-y-3">
                    {/* User Info */}
                    {session?.user && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
                            <UserAvatar size={40} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {session.user.name || "Member"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <SignOutButton className="w-full justify-start text-red-400 hover:bg-red-400/10" />
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center justify-between p-4">
                    <Link href="/app" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                            <IconSparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-light">
                            BECOMING <span className="text-primary">DIAMOND</span>
                        </span>
                    </Link>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isSidebarOpen ? (
                            <IconX className="w-6 h-6" />
                        ) : (
                            <IconMenu2 className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-secondary/50 to-black border-r border-white/10 z-50 overflow-y-auto">
                        {/* Logo */}
                        <div className="p-6 border-b border-white/10">
                            <Link href="/app" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/10 rounded-lg flex items-center justify-center">
                                        <IconSparkles className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
                                </div>
                                <div>
                                    <h1 className="text-lg font-light tracking-wide">
                                        BECOMING <span className="text-primary font-normal">DIAMOND</span>
                                    </h1>
                                    <p className="text-xs text-gray-500">Member Portal</p>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative",
                                                active
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {active && (
                                                <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                                            )}
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="font-light">{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Section & Logout */}
                        <div className="p-4 border-t border-white/10 space-y-3">
                            {/* User Info */}
                            {session?.user && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
                                    <UserAvatar size={40} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {session.user.name || "Member"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Logout Button */}
                            <SignOutButton className="w-full justify-start text-red-400 hover:bg-red-400/10" />
                        </div>
                    </aside>
                </>
            )
            }

            {/* Main Content */}
            <main className="flex-1 lg:ml-72">
                {/* Mobile top spacing */}
                <div className="lg:hidden h-16"></div>

                <div className="min-h-screen">
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
