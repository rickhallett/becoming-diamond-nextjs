/**
 * Client-Side Providers Wrapper
 *
 * Wraps the application with necessary providers including SessionProvider.
 * Must be a client component to use React Context.
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/UserContext";
import { CourseProvider } from "@/contexts/CourseContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <CourseProvider>
          {children}
        </CourseProvider>
      </UserProvider>
    </SessionProvider>
  );
}
