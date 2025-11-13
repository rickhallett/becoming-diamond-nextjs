import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTursoClient } from '@/lib/turso-adapter';
import { log } from '@axiomhq/nextjs';

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

    await log.info('User profile fetched from database', {
      userId: userId,
      hasName: !!user.name,
      hasEmail: !!user.email,
      timestamp: new Date().toISOString(),
    });

    // Fetch user profile (additional fields including progress)
    const profileResult = await turso.execute({
      sql: `SELECT bio, location, website, current_pr, completed_prs, level, xp, streak
            FROM user_profiles WHERE user_id = ?`,
      args: [userId],
    });

    const profileData = profileResult.rows[0];

    await log.info('User profile data retrieved', {
      userId,
      hasProfileData: !!profileData,
      currentPR: profileData?.current_pr,
      level: profileData?.level,
      timestamp: new Date().toISOString(),
    });

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

    await log.info('Profile returned successfully', {
      userId: profile.id,
      currentPR: profile.currentPR,
      level: profile.level,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ profile });
  } catch (error) {
    await log.error('Error fetching profile', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
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

    await log.info('Profile update request received', {
      userId,
      fieldsToUpdate: Object.keys(updates),
      timestamp: new Date().toISOString(),
    });

    // Update name in users table if provided
    if (updates.name !== undefined) {
      await turso.execute({
        sql: `UPDATE users SET name = ?, updated_at = ? WHERE id = ?`,
        args: [updates.name, now, userId],
      });
      await log.info('Updated name in users table', {
        userId,
        timestamp: new Date().toISOString(),
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
      // Check if profile exists
      const checkResult = await turso.execute({
        sql: `SELECT id FROM user_profiles WHERE user_id = ?`,
        args: [userId],
      });

      if (checkResult.rows.length === 0) {
        // Profile doesn't exist - create it
        await log.info('Profile not found, creating new profile', {
          userId,
          timestamp: new Date().toISOString(),
        });
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
        await log.info('Created new profile', {
          userId,
          profileId,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Profile exists - update it
        profileFields.push('updated_at = ?');
        profileValues.push(now);
        profileValues.push(userId);

        const sql = `UPDATE user_profiles SET ${profileFields.join(', ')} WHERE user_id = ?`;

        const result = await turso.execute({
          sql,
          args: profileValues,
        });

        await log.info('Updated user profile', {
          userId,
          rowsAffected: result.rowsAffected,
          fieldsUpdated: profileFields.length - 1,
          timestamp: new Date().toISOString(),
        });
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
    await log.error('Error updating profile', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
