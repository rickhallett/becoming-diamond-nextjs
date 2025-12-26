"use client";

import { signOut } from "next-auth/react";
import { IconLogout } from "@tabler/icons-react";
import { useState } from "react";

interface SignOutButtonProps {
  className?: string;
  showIcon?: boolean;
}

export function SignOutButton({ className = "", showIcon = true }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50 ${className}`}
    >
      {showIcon && <IconLogout className="w-5 h-5" />}
      <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
