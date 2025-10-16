import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import crypto from 'crypto';

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  // Check authentication (NextAuth session or test auth)
  const session = await auth();
  const testAuthHeader = request.headers.get('x-test-auth');

  if (!session && !testAuthHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { videoId } = await params;

  // Generate signed URL token
  const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const tokenBase = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${videoId}`;
  const token = crypto
    .createHash('sha256')
    .update(tokenBase)
    .digest('hex');

  const streamUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/playlist.m3u8?token=${token}&expires=${expirationTime}`;

  return NextResponse.json({
    streamUrl,
    token,
    expiresAt: new Date(expirationTime * 1000).toISOString(),
  });
}
