import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "support@becomingdiamond.com";

// Wrapper API for leads that checks NextAuth session
// This allows the admin UI to access leads without exposing the API key
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters from the original request
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);

    // Forward the request to the internal leads API
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey) {
      return NextResponse.json(
        { success: false, error: "Admin API key not configured" },
        { status: 500 }
      );
    }

    // Build the internal API URL
    const internalUrl = new URL("/api/leads", url.origin);
    internalUrl.search = params.toString();

    const response = await fetch(internalUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${adminKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Internal API error: ${response.statusText}`);
    }

    // Check if CSV format was requested
    const format = params.get("format");
    if (format === "csv") {
      const csv = await response.text();
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Return JSON
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}
