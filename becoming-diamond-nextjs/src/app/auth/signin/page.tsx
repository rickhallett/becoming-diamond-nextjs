"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { IconBrandGoogle, IconBrandGithub, IconMail, IconFlask } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/app",
      });

      if (result?.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/app" });
  };

  const handleTestLogin = () => {
    login("test-user-" + Date.now(), "test");
    router.push("/app");
  };

  if (emailSent) {
    return (
      <main className="relative bg-black min-h-screen flex items-center justify-center overflow-hidden">
        <Spotlight className="top-0 left-1/4 md:-top-20" fill="#4fc3f7" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md px-6"
        >
          <div className="bg-secondary/30 backdrop-blur-sm border border-primary/30 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <IconMail className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h2 className="text-2xl font-light text-white mb-2">
              Check Your Email
            </h2>

            <p className="text-gray-400 mb-6">
              We sent a magic link to <strong className="text-white">{email}</strong>
            </p>

            <p className="text-sm text-gray-500">
              Click the link in the email to sign in to your account.
              The link expires in 24 hours.
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative bg-black min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <Spotlight className="top-0 left-1/4 md:-top-20" fill="#4fc3f7" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-secondary/30 backdrop-blur-sm border border-primary/30 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white mb-2">
              Welcome to <span className="text-primary">Becoming Diamond</span>
            </h1>
            <p className="text-gray-400">Sign in to access your member portal</p>
          </div>

          {/* Email Sign-In Form */}
          <form onSubmit={handleEmailSignIn} className="mb-6">
            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-secondary/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-black font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending magic link...
                </>
              ) : (
                <>
                  <IconMail className="w-5 h-5" />
                  Continue with Email
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative bg-secondary px-4 text-sm text-gray-500">
              Or continue with
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthSignIn("google")}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <IconBrandGoogle className="w-5 h-5" />
              Sign in with Google
            </button>

            <button
              onClick={() => handleOAuthSignIn("github")}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <IconBrandGithub className="w-5 h-5" />
              Sign in with GitHub
            </button>
          </div>

          {/* Test Login (Development) */}
          {process.env.NODE_ENV === "development" && (
            <>
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-yellow-500/20"></div>
                </div>
                <div className="relative bg-secondary px-4 text-xs text-yellow-500/60">
                  Development Only
                </div>
              </div>

              <button
                onClick={handleTestLogin}
                className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <IconFlask className="w-5 h-5" />
                Test Login (Bypass Auth)
              </button>
            </>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              New to Becoming Diamond?{" "}
              <Link href="/#book" className="text-primary hover:underline">
                Purchase Access
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
