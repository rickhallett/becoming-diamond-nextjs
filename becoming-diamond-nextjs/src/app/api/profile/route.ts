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

    // Log user data for debugging
    console.log('[Profile API] User data:', {
      id: user.id,
      name: user.name,
      email: user.email,
      nameType: typeof user.name,
      nameValue: user.name === null ? 'NULL' : user.name === undefined ? 'UNDEFINED' : user.name,
    });

    // Fetch user profile (additional fields including progress)
    const profileResult = await turso.execute({
      sql: `SELECT bio, location, website, current_pr, completed_prs, level, xp, streak
            FROM user_profiles WHERE user_id = ?`,
      args: [userId],
    });

    const profileData = profileResult.rows[0];

    // Log for debugging
    console.log('[Profile API] User ID:', userId);
    console.log('[Profile API] Profile data found:', !!profileData);
    if (profileData) {
      console.log('[Profile API] Profile fields:', {
        current_pr: profileData.current_pr,
        level: profileData.level,
        xp: profileData.xp,
        streak: profileData.streak,
      });
    }

    // Parse completed_prs JSON string to array
    let completedPRs: number[] = [];
    if (profileData?.completed_prs) {
      try {
        completedPRs = JSON.parse(profileData.completed_prs as string);
      } catch (e) {
        console.error('Failed to parse completed_prs:', e);
      }
    }

    // Transform to UserProfile format
    const profile = {
      id: user.id as string,
      name: (user.name as string) || (user.email as string)?.split('@')[0] || 'User',
      email: (user.email as string) || '',
      avatar: (user.image as string) || '/profile-placeholder.webp',
      bio: (profileData?.bio as string) || '',
      location: (profileData?.location as string) || '',
      website: (profileData?.website as string) || '',
      joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
      currentPR: (profileData?.current_pr as number) || 1,
      completedPRs,
      level: (profileData?.level as string) || 'Initiate',
      xp: (profileData?.xp as number) || 0,
      streak: (profileData?.streak as number) || 0,
    };

    console.log('[Profile API] Returning profile:', {
      id: profile.id,
      name: profile.name,
      currentPR: profile.currentPR,
      level: profile.level,
      xp: profile.xp,
    });

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

    console.log('[Profile API PUT] User ID:', userId);
    console.log('[Profile API PUT] Updates received:', updates);

    // Update name in users table if provided
    if (updates.name !== undefined) {
      await turso.execute({
        sql: `UPDATE users SET name = ?, updated_at = ? WHERE id = ?`,
        args: [updates.name, now, userId],
      });
      console.log('[Profile API PUT] Updated name in users table');
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
      // Check if profile exists
      const checkResult = await turso.execute({
        sql: `SELECT id FROM user_profiles WHERE user_id = ?`,
        args: [userId],
      });

      if (checkResult.rows.length === 0) {
        // Profile doesn't exist - create it
        console.log('[Profile API PUT] Profile not found, creating new profile');
        const profileId = crypto.randomUUID();
        await turso.execute({
          sql: `INSERT INTO user_profiles (id, user_id, bio, location, website, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            profileId,
            userId,
            updates.bio || '',
            updates.location || '',
            updates.website || '',
            now,
            now,
          ],
        });
        console.log('[Profile API PUT] Created new profile');
      } else {
        // Profile exists - update it
        profileFields.push('updated_at = ?');
        profileValues.push(now);
        profileValues.push(userId);

        const sql = `UPDATE user_profiles SET ${profileFields.join(', ')} WHERE user_id = ?`;
        console.log('[Profile API PUT] Updating user_profiles:', { sql, args: profileValues });

        const result = await turso.execute({
          sql,
          args: profileValues,
        });

        console.log('[Profile API PUT] Update result:', { rowsAffected: result.rowsAffected });
      }
    }

    // Fetch updated user data
    const result = await turso.execute({
      sql: `SELECT id, name, email, image, created_at FROM users WHERE id = ?`,
      args: [userId],
    });

    const user = result.rows[0];

    const profileResult = await turso.execute({
      sql: `SELECT bio, location, website, current_pr, completed_prs, level, xp, streak
            FROM user_profiles WHERE user_id = ?`,
      args: [userId],
    });

    const profileData = profileResult.rows[0] || {};

    // Parse completed_prs JSON string to array
    let completedPRs: number[] = [];
    if (profileData.completed_prs) {
      try {
        completedPRs = JSON.parse(profileData.completed_prs as string);
      } catch (e) {
        console.error('Failed to parse completed_prs:', e);
      }
    }

    const profile = {
      id: user.id as string,
      name: (user.name as string) || (user.email as string)?.split('@')[0] || 'User',
      email: (user.email as string) || '',
      avatar: (user.image as string) || '/profile-placeholder.webp',
      bio: (profileData.bio as string) || '',
      location: (profileData.location as string) || '',
      website: (profileData.website as string) || '',
      joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
      currentPR: (profileData.current_pr as number) || 1,
      completedPRs,
      level: (profileData.level as string) || 'Initiate',
      xp: (profileData.xp as number) || 0,
      streak: (profileData.streak as number) || 0,
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
