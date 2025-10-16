import { NextRequest, NextResponse } from 'next/server';
import { getSprintDay } from '@/lib/content';
import { log } from '@/lib/logger';

// Generate static params for all 30 days at build time
export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    dayNumber: String(i + 1),
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  try {
    const { dayNumber: dayNumberStr } = await params;
    const dayNumber = parseInt(dayNumberStr, 10);

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      return NextResponse.json(
        { error: 'Invalid day number' },
        { status: 400 }
      );
    }

    const day = await getSprintDay(dayNumber);

    if (!day) {
      return NextResponse.json(
        { error: 'Day not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ day });
  } catch (error) {
    await log.error('Error fetching sprint day:', 'API', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint day' },
      { status: 500 }
    );
  }
}
