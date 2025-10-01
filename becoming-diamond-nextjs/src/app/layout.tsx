"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UserProvider } from "@/contexts/UserContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { ChatProvider } from "@/contexts/ChatContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <CourseProvider>
            <ChatProvider>
              <SpeedInsights />
              {children}
            </ChatProvider>
          </CourseProvider>
        </UserProvider>
      </body>
    </html>
  );
}
