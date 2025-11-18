"use client";

import { useSession } from "next-auth/react";
import { IconUser } from "@tabler/icons-react";
import Image from "next/image";

interface UserAvatarProps {
  className?: string;
  size?: number;
}

/**
 * Get user initials from name or email
 */
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      // First and last name: "John Doe" -> "JD"
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    // Single name: "Madonna" -> "M"
    return parts[0][0].toUpperCase();
  }

  if (email) {
    // Email fallback: "test@example.com" -> "T"
    return email[0].toUpperCase();
  }

  return '?';
}

export function UserAvatar({ className = "", size = 40 }: UserAvatarProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div
        className={`rounded-full bg-white/10 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <IconUser className="text-gray-400" style={{ width: size * 0.6, height: size * 0.6 }} />
      </div>
    );
  }

  // If user has an image, show it
  if (session.user.image) {
    return (
      <div className={`relative rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  // Otherwise, show initials
  const initials = getInitials(session.user.name, session.user.email);

  return (
    <div
      className={`rounded-full bg-primary/20 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="text-primary font-semibold"
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </span>
    </div>
  );
}
