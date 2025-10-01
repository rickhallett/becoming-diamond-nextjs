"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { IconAlertCircle } from "@tabler/icons-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: "Configuration Error",
      description: "There is a problem with the server configuration. Please contact support.",
    },
    AccessDenied: {
      title: "Access Denied",
      description: "You do not have permission to sign in. Please contact support if you believe this is an error.",
    },
    Verification: {
      title: "Verification Link Expired",
      description: "The verification link has expired. Please request a new one.",
    },
    OAuthSignin: {
      title: "OAuth Sign-In Error",
      description: "Error connecting to the authentication provider. Please try again.",
    },
    OAuthCallback: {
      title: "OAuth Callback Error",
      description: "Authentication failed during the callback. Please try again.",
    },
    OAuthCreateAccount: {
      title: "Cannot Create Account",
      description: "Could not create your account. The email may already be in use with a different provider.",
    },
    EmailCreateAccount: {
      title: "Cannot Create Account",
      description: "Could not create your account with this email. Please try again.",
    },
    Callback: {
      title: "Callback Error",
      description: "Authentication callback failed. Please try again.",
    },
    Default: {
      title: "Authentication Error",
      description: "An error occurred during sign-in. Please try again.",
    },
  };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <main className="relative bg-black min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <Spotlight className="top-0 left-1/4 md:-top-20" fill="#ef4444" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-500/5 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-secondary/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <IconAlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-white mb-3">{errorInfo.title}</h1>
            <p className="text-gray-400">{errorInfo.description}</p>
          </div>

          {/* Error Code (if available) */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400 text-center">
                Error Code: <code className="font-mono">{error}</code>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full bg-primary hover:bg-primary/90 text-black text-center font-medium py-3 px-6 rounded-lg transition-all"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-center font-medium py-3 px-6 rounded-lg transition-all"
            >
              Go to Home
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a href="mailto:support@becomingdiamond.com" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
