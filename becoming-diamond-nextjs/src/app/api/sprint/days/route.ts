import { NextResponse } from 'next/server';
import { getSprintDays } from '@/lib/content';
import { log } from '@/lib/logger';

// Force static generation at build time
export const dynamic = 'force-static';

export async function GET() {
  try {
    const days = await getSprintDays();
    return NextResponse.json({ days });
  } catch (error) {
    await log.error('Error fetching sprint days:', 'API', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint days' },
      { status: 500 }
    );
  }
}
