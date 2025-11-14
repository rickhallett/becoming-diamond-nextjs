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

  // Use user image or fallback to placeholder avatar
  const imageSrc = session.user.image || '/profile-placeholder-2.webp';

  return (
    <div className={`relative rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageSrc}
        alt={session.user.name || "User"}
        fill
        className="object-cover"
      />
    </div>
  );
}
