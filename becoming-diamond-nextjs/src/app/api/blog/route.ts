import { getContentByType } from "@/lib/content";
import { NextResponse } from "next/server";
import { log } from '@/lib/logger';

export async function GET() {
  try {
    const posts = await getContentByType("blog");
    return NextResponse.json(posts);
  } catch (error) {
    await log.error("Error fetching blog posts:", 'API', error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
