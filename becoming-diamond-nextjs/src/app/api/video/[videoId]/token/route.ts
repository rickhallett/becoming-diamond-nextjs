import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import crypto from 'crypto';
import { log } from '@/lib/axiom-logger';

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;

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
      timestamp: new Date().toISOString(),
    });

    const streamUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/playlist.m3u8?token=${token}&expires=${expirationTime}`;

    return NextResponse.json({
      streamUrl,
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
