"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { IconBrandGoogle, IconBrandGithub, IconBrandApple, IconDiamond } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";

export default function AuthPage() {
    const router = useRouter();
    const { login } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTestLogin = () => {
        setLoading(true);
        // Generate a test user ID
        const userId = `user_${Date.now()}`;
        login(userId, 'test');
        // Simulate a brief loading state
        setTimeout(() => {
            router.push("/app");
        }, 800);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Generate user ID from email for demo purposes
        const userId = `user_${email.split('@')[0]}_${Date.now()}`;
        login(userId, 'email');
        setTimeout(() => {
            router.push("/app");
        }, 800);
    };

    const handleSSOLogin = (provider: 'google' | 'github' | 'apple') => {
        setLoading(true);
        // Generate user ID from provider
        const userId = `user_${provider}_${Date.now()}`;
        login(userId, provider === 'github' ? 'github' : 'google');
        // Simulate SSO authentication
        setTimeout(() => {
            router.push("/app");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
            <BackgroundBeams className="opacity-40" />

            {/* Back to Home - Diamond Icon */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-10 group"
            >
                <div className="relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30 group-hover:bg-primary/30 transition-all">
                        <IconDiamond className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </Link>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-light mb-3">
                        BECOMING <span className="text-primary">DIAMOND</span>
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? "Welcome back. Continue your transformation." : "Begin your transformation journey."}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    {/* Toggle between Login and Signup */}
                    <div className="flex gap-2 mb-6 bg-black/30 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-md text-sm transition-all ${isLogin
                                ? "bg-primary text-black font-medium"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-md text-sm transition-all ${!isLogin
                                ? "bg-primary text-black font-medium"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-2"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2"
                                required
                            />
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black py-3 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-4 text-xs text-gray-500">OR</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    {/* SSO Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSSOLogin("google")}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            <IconBrandGoogle className="w-5 h-5" />
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSSOLogin("github")}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            <IconBrandGithub className="w-5 h-5" />
                            Continue with GitHub
                        </button>

                        <button
                            onClick={() => handleSSOLogin("apple")}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            <IconBrandApple className="w-5 h-5" />
                            Continue with Apple
                        </button>
                    </div>

                    {/* Test Login Button */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex justify-center">
                            <button
                                onClick={handleTestLogin}
                                disabled={loading}
                                className="bg-black text-primary px-6 py-2 text-sm font-medium border border-primary rounded-lg hover:bg-primary/10 transition-all disabled:opacity-50"
                            >
                                Test Login (Skip Auth)
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            For development purposes only
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center mt-6">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
