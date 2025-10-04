import { NextResponse } from 'next/server';
import { getSprintDays } from '@/lib/content';

// Force static generation at build time
export const dynamic = 'force-static';

export async function GET() {
  try {
    const days = await getSprintDays();
    return NextResponse.json({ days });
  } catch (error) {
    console.error('Error fetching sprint days:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint days' },
      { status: 500 }
    );
  }
}
