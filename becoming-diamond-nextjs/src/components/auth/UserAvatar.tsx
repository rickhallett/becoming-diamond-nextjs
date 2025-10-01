"use client";

import { useSession } from "next-auth/react";
import { IconUser } from "@tabler/icons-react";
import Image from "next/image";

interface UserAvatarProps {
  className?: string;
  size?: number;
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

  // Fallback to initials
  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || session.user.email?.[0]?.toUpperCase() || "U";

  return (
    <div
      className={`rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
