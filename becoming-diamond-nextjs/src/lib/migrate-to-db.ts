/**
 * Migration utility to move data from localStorage to database
 * This handles the transition from Phase 1 (client-side) to Phase 2 (database)
 */

import { storage, STORAGE_KEYS } from './storage';

export interface MigrationResult {
  success: boolean;
  migratedCourses: number;
  migratedChats: number;
  migratedActivities: number;
  errors: string[];
}

/**
 * Migrate user's localStorage data to database via API
 */
export async function migrateToDatabase(): Promise<MigrationResult> {
  const errors: string[] = [];
  let migratedCourses = 0;
  let migratedChats = 0;
  let migratedActivities = 0;

  try {
    // 1. Migrate course enrollments
    const courseProgress = storage.getItem<any[]>(STORAGE_KEYS.COURSE_PROGRESS);
    if (courseProgress && courseProgress.length > 0) {
      for (const enrollment of courseProgress) {
        try {
          // Enroll in course
          await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId: enrollment.courseId }),
          });

          // Update progress if any
          if (enrollment.progress > 0 || enrollment.lessonsCompleted?.length > 0) {
            await fetch('/api/courses', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                courseId: enrollment.courseId,
                updates: {
                  progress: enrollment.progress,
                  lessonsCompleted: enrollment.lessonsCompleted || [],
                  completedDate: enrollment.completedDate,
                  currentLesson: enrollment.currentLesson,
                  timeSpent: enrollment.timeSpent || 0,
                },
              }),
            });
          }

          migratedCourses++;
        } catch (err) {
          errors.push(`Failed to migrate course ${enrollment.courseId}: ${err}`);
        }
      }
    }

    // 2. Migrate chat sessions
    const chatSessions = storage.getItem<any[]>(STORAGE_KEYS.CHAT_SESSIONS);
    if (chatSessions && chatSessions.length > 0) {
      for (const session of chatSessions) {
        try {
          // Create session
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: session.title }),
          });

          const { session: newSession } = await response.json();

          // Add messages
          if (session.messages && session.messages.length > 0) {
            for (const message of session.messages) {
              await fetch('/api/chat', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId: newSession.id,
                  message: {
                    role: message.role,
                    content: message.content,
                  },
                }),
              });
            }
          }

          migratedChats++;
        } catch (err) {
          errors.push(`Failed to migrate chat session ${session.id}: ${err}`);
        }
      }
    }

    // 3. Migrate activity log
    const activities = storage.getItem<any[]>(STORAGE_KEYS.ACTIVITY_LOG);
    if (activities && activities.length > 0) {
      for (const activity of activities) {
        try {
          await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: activity.type,
              description: activity.description,
              metadata: activity.metadata,
            }),
          });

          migratedActivities++;
        } catch (err) {
          errors.push(`Failed to migrate activity ${activity.id}: ${err}`);
        }
      }
    }

    // 4. Clear localStorage after successful migration
    if (errors.length === 0) {
      storage.removeItem(STORAGE_KEYS.COURSE_PROGRESS);
      storage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
      storage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);

      // Mark migration as complete
      storage.setItem('bd_migration_completed', {
        timestamp: new Date().toISOString(),
        version: '1.0',
      });
    }

    return {
      success: errors.length === 0,
      migratedCourses,
      migratedChats,
      migratedActivities,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      migratedCourses,
      migratedChats,
      migratedActivities,
      errors: [...errors, `Migration failed: ${error}`],
    };
  }
}

/**
 * Check if migration has been completed
 */
export function isMigrationComplete(): boolean {
  const migrationData = storage.getItem<any>('bd_migration_completed');
  return migrationData !== null;
}

/**
 * Check if user has data in localStorage that needs migration
 */
export function hasPendingMigration(): boolean {
  if (isMigrationComplete()) return false;

  const courseProgress = storage.getItem<any[]>(STORAGE_KEYS.COURSE_PROGRESS);
  const chatSessions = storage.getItem<any[]>(STORAGE_KEYS.CHAT_SESSIONS);
  const activities = storage.getItem<any[]>(STORAGE_KEYS.ACTIVITY_LOG);

  return !!(
    (courseProgress && courseProgress.length > 0) ||
    (chatSessions && chatSessions.length > 0) ||
    (activities && activities.length > 0)
  );
}
