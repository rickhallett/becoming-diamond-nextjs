import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface BunnyVideo {
  guid: string;
  title: string;
  dateUploaded: string;
  length: number;
  status: number;
  views: number;
  thumbnailFileName: string;
  collectionId?: string;
  width?: number;
  height?: number;
  availableResolutions?: string;
}

interface CacheEntry {
  data: BunnyVideo[];
  timestamp: number;
}

let videoCache: CacheEntry | null = null;

/**
 * GET /api/videos
 * List all videos from Bunny Stream library with 5-minute caching
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check cache
    const now = Date.now();
    if (videoCache && now - videoCache.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json({
        videos: videoCache.data,
        cached: true,
        cachedAt: new Date(videoCache.timestamp).toISOString(),
      });
    }

    // Fetch from Bunny Stream API
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos?page=1&itemsPerPage=1000`,
      {
        headers: {
          AccessKey: BUNNY_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Bunny API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const videos = data.items || [];

    // Update cache
    videoCache = {
      data: videos,
      timestamp: now,
    };

    return NextResponse.json({
      videos,
      cached: false,
      totalCount: data.totalItems || videos.length,
      currentPage: data.currentPage || 1,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
