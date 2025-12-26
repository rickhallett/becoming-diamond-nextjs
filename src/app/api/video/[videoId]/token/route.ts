import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import crypto from 'crypto';
import { log } from '@/lib/axiom-logger';

interface BunnyVideoMetadata {
  guid: string;
  title: string;
  thumbnailFileName?: string;
  status: number;
  [key: string]: unknown;
}

/**
 * Validates that required Bunny Stream credentials are present.
 * Implements fail-fast pattern to prevent silent misconfiguration.
 */
function validateBunnyCredentials(): { libraryId: string; apiKey: string; cdnHostname: string } {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  const cdnHostname = process.env.BUNNY_STREAM_CDN_HOSTNAME;

  if (!libraryId || libraryId.trim() === '') {
    throw new Error(
      'BUNNY_STREAM_LIBRARY_ID is not configured. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'BUNNY_STREAM_API_KEY is not configured. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  if (!cdnHostname || cdnHostname.trim() === '') {
    throw new Error(
      'BUNNY_STREAM_CDN_HOSTNAME is not configured. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  return { libraryId, apiKey, cdnHostname };
}

// Validate credentials at module load time (fail-fast)
const { libraryId: BUNNY_LIBRARY_ID, apiKey: BUNNY_API_KEY, cdnHostname: BUNNY_CDN_HOSTNAME } = validateBunnyCredentials();

/**
 * Fetches video metadata from Bunny Stream API to get thumbnail filename
 */
async function fetchVideoMetadata(videoId: string): Promise<BunnyVideoMetadata | null> {
  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
      {
        headers: {
          'AccessKey': BUNNY_API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      await log.warn('Failed to fetch video metadata', {
        videoId,
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    await log.error('Error fetching video metadata', {
      videoId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  // Check authentication - MUST have valid NextAuth session
  const session = await auth();
  const { videoId } = await params;

  await log.info('Video token request', {
    videoId,
    userId: session?.user?.id || 'unauthenticated',
    hasSession: !!session,
    timestamp: new Date().toISOString(),
  });

  // Security: Only allow authenticated users with valid sessions
  // Client-side authentication checks are NOT secure
  if (!session || !session.user) {
    await log.warn('Unauthorized video token request', {
      videoId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch video metadata to get thumbnail filename
    const metadata = await fetchVideoMetadata(videoId);

    // Generate signed URL token
    const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours
    const tokenBase = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${videoId}`;
    const token = crypto
      .createHash('sha256')
      .update(tokenBase)
      .digest('hex');

    await log.info('Video token generated', {
      videoId,
      userId: session?.user?.id,
      expiresAt: new Date(expirationTime * 1000).toISOString(),
      tokenLength: token.length,
      hasThumbnail: !!metadata?.thumbnailFileName,
      timestamp: new Date().toISOString(),
    });

    const streamUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/playlist.m3u8?token=${token}&expires=${expirationTime}`;

    // Generate thumbnail URL if metadata available
    let thumbnailUrl: string | undefined;
    if (metadata?.thumbnailFileName) {
      thumbnailUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/${metadata.thumbnailFileName}?token=${token}&expires=${expirationTime}`;
    }

    return NextResponse.json({
      streamUrl,
      thumbnailUrl,
      token,
      expiresAt: new Date(expirationTime * 1000).toISOString(),
    });
  } catch (error) {
    await log.error('Failed to generate video token', {
      videoId,
      userId: session?.user?.id,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 });
  }
}
