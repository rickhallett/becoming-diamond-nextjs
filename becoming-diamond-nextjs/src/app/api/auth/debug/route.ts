import { NextResponse } from "next/server";

export async function GET() {
  // Debug endpoint to check auth configuration
  const config = {
    authUrl: process.env.AUTH_URL || process.env.NEXTAUTH_URL || "NOT SET",
    authSecret: process.env.AUTH_SECRET ? "SET (hidden)" : "NOT SET",
    googleId: process.env.AUTH_GOOGLE_ID ? "SET (hidden)" : "NOT SET",
    googleSecret: process.env.AUTH_GOOGLE_SECRET ? "SET (hidden)" : "NOT SET",
    gmailUser: process.env.GMAIL_USER || "NOT SET",
    gmailPassword: process.env.GMAIL_APP_PASSWORD ? "SET (hidden)" : "NOT SET",
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  return NextResponse.json(config);
}
