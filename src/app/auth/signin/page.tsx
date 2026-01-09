"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { IconBrandGoogle, IconBrandGithub, IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { AUTH_CONFIG } from "@/config/features";
import { logSync as log } from '@/lib/logger';

type AuthMode = "magic-link" | "password";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("magic-link");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: AUTH_CONFIG.successRedirectUri,
      });

      if (result?.ok) {
        setEmailSent(true);
      } else if (result?.error) {
        setError(result.error === "EmailSignin"
          ? "Failed to send magic link. Please try again or use another sign-in method."
          : "An error occurred. Please try again.");
        log.error("Sign-in failed:", 'App', result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      log.error("Sign-in error:", 'App', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: AUTH_CONFIG.successRedirectUri,
      });

      if (result?.ok) {
        // Successful login - redirect to member portal
        window.location.href = AUTH_CONFIG.successRedirectUri;
      } else if (result?.error) {
        // Handle specific error cases
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. If you haven't set a password yet, use magic link to sign in.");
        } else {
          setError("An error occurred. Please try again.");
        }
        log.error("Password sign-in failed:", 'App', result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      log.error("Password sign-in error:", 'App', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: AUTH_CONFIG.successRedirectUri });
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

          {/* Auth Mode Toggle */}
          <div className="flex rounded-lg bg-secondary/50 p-1 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode("magic-link")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMode === "magic-link"
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IconMail className="w-4 h-4" />
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMode === "password"
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IconLock className="w-4 h-4" />
              Password
            </button>
          </div>

          {/* Sign-In Form */}
          <form onSubmit={authMode === "magic-link" ? handleEmailSignIn : handlePasswordSignIn} className="mb-6">
            <div className="space-y-4">
              <div>
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
              </div>

              {authMode === "password" && (
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-12 bg-secondary/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    No password? Use Magic Link to sign in, then set a password in your profile.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || (authMode === "password" && !password)}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-black font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {authMode === "magic-link" ? "Sending magic link..." : "Signing in..."}
                </>
              ) : (
                <>
                  {authMode === "magic-link" ? (
                    <>
                      <IconMail className="w-5 h-5" />
                      Send Magic Link
                    </>
                  ) : (
                    <>
                      <IconLock className="w-5 h-5" />
                      Sign In
                    </>
                  )}
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

            {AUTH_CONFIG.githubAuth && (
              <button
                onClick={() => handleOAuthSignIn("github")}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <IconBrandGithub className="w-5 h-5" />
                Sign in with GitHub
              </button>
            )}
          </div>


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
