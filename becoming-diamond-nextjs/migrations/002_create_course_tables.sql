-- Course and Progress Tables for Member Portal
-- Migration: 002 - Create course enrollment and progress tracking tables

-- Course enrollments table
-- Tracks which courses users are enrolled in and their overall progress
CREATE TABLE IF NOT EXISTS course_enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  pressure_room INTEGER NOT NULL,
  enrolled_at INTEGER DEFAULT (unixepoch()),
  started_at INTEGER,
  completed_at INTEGER,
  progress INTEGER DEFAULT 0, -- Overall course progress percentage (0-100)
  status TEXT DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed', 'dropped'
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS course_enrollments_user_id_idx ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS course_enrollments_status_idx ON course_enrollments(status);

-- Lesson progress tracking table
-- Tracks completion of individual lessons within courses
CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  completed_at INTEGER,
  time_spent INTEGER DEFAULT 0, -- Time spent in seconds
  notes TEXT, -- User notes for the lesson
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_id_idx ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS lesson_progress_course_id_idx ON lesson_progress(course_id);

-- User activity log table
-- Tracks all user activities for gamification and analytics
CREATE TABLE IF NOT EXISTS user_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'course_enrolled', 'lesson_completed', 'pr_completed', 'achievement_earned', etc.
  description TEXT NOT NULL,
  metadata TEXT, -- JSON string for additional data
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS user_activities_user_id_idx ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS user_activities_type_idx ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS user_activities_created_at_idx ON user_activities(created_at);

-- User achievements table
-- Tracks earned achievements and badges
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_key TEXT NOT NULL, -- Unique identifier for the achievement type
  title TEXT NOT NULL,
  description TEXT,
  earned_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, achievement_key)
);

CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS user_achievements_achievement_key_idx ON user_achievements(achievement_key);
