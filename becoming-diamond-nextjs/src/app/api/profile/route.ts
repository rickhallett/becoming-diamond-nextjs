import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';

const turso = getTursoClient();

/**
 * GET /api/profile
 * Fetch authenticated user's profile
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch user from database
    const result = await turso.execute({
      sql: `SELECT id, name, email, image, created_at FROM users WHERE id = ?`,
      args: [userId],
    });

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Fetch user profile (additional fields)
    const profileResult = await turso.execute({
      sql: `SELECT bio, location, website FROM user_profiles WHERE user_id = ?`,
      args: [userId],
    });

    const profileData = profileResult.rows[0] || {};

    // Transform to UserProfile format
    const profile = {
      id: user.id as string,
      name: (user.name as string) || 'Diamond Member',
      email: (user.email as string) || '',
      avatar: (user.image as string) || '/profile-placeholder.webp',
      bio: (profileData.bio as string) || '',
      location: (profileData.location as string) || '',
      website: (profileData.website as string) || '',
      joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
      currentPR: 1, // TODO: fetch from user progress
      completedPRs: [], // TODO: fetch from user progress
      level: 'Initiate', // TODO: calculate from user progress
      xp: 0, // TODO: fetch from user progress
      streak: 0, // TODO: calculate from activity
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update authenticated user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const updates = await request.json();
    const now = Math.floor(Date.now() / 1000);

    // Update name in users table if provided
    if (updates.name !== undefined) {
      await turso.execute({
        sql: `UPDATE users SET name = ?, updated_at = ? WHERE id = ?`,
        args: [updates.name, now, userId],
      });
    }

    // Update profile fields (bio, location, website)
    const profileFields: string[] = [];
    const profileValues: any[] = [];

    if (updates.bio !== undefined) {
      profileFields.push('bio = ?');
      profileValues.push(updates.bio);
    }
    if (updates.location !== undefined) {
      profileFields.push('location = ?');
      profileValues.push(updates.location);
    }
    if (updates.website !== undefined) {
      profileFields.push('website = ?');
      profileValues.push(updates.website);
    }

    if (profileFields.length > 0) {
      profileFields.push('updated_at = ?');
      profileValues.push(now);
      profileValues.push(userId);

      await turso.execute({
        sql: `UPDATE user_profiles SET ${profileFields.join(', ')} WHERE user_id = ?`,
        args: profileValues,
      });
    }

    // Fetch updated user data
    const result = await turso.execute({
      sql: `SELECT id, name, email, image, created_at FROM users WHERE id = ?`,
      args: [userId],
    });

    const user = result.rows[0];

    const profileResult = await turso.execute({
      sql: `SELECT bio, location, website FROM user_profiles WHERE user_id = ?`,
      args: [userId],
    });

    const profileData = profileResult.rows[0] || {};

    const profile = {
      id: user.id as string,
      name: (user.name as string) || 'Diamond Member',
      email: (user.email as string) || '',
      avatar: (user.image as string) || '/profile-placeholder.webp',
      bio: (profileData.bio as string) || '',
      location: (profileData.location as string) || '',
      website: (profileData.website as string) || '',
      joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
      currentPR: 1,
      completedPRs: [],
      level: 'Initiate',
      xp: 0,
      streak: 0,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
