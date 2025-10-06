"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useUser } from './UserContext';
import { logSync as log } from '@/lib/logger';

// Course enrollment interface
export interface CourseEnrollment {
  courseId: string;
  enrolledDate: string;
  completedDate?: string;
  progress: number; // 0-100
  lastAccessedDate: string;
  lessonsCompleted: string[];
  currentLesson?: string;
  timeSpent: number; // minutes
}

// Course data interface
export interface Course {
  id: string;
  title: string;
  description: string;
  pressureRoom: number;
  thumbnail?: string;
  duration: string; // e.g., "4 weeks"
  lessons: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor?: string;
}

// Activity log interface
export interface ActivityLog {
  id: string;
  userId: string;
  type: 'course_enrolled' | 'lesson_completed' | 'pr_completed' | 'achievement_earned' | 'profile_updated' | 'login';
  timestamp: string;
  metadata: Record<string, unknown>;
  description: string;
}

// Context value interface
interface CourseContextValue {
  enrollments: CourseEnrollment[];
  activities: ActivityLog[];
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, updates: Partial<CourseEnrollment>) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  completeCourse: (courseId: string) => void;
  logActivity: (type: ActivityLog['type'], description: string, metadata?: Record<string, unknown>) => void;
  getEnrollment: (courseId: string) => CourseEnrollment | undefined;
  isEnrolled: (courseId: string) => boolean;
  getRecentActivities: (limit?: number) => ActivityLog[];
}

// Create context
const CourseContext = createContext<CourseContextValue | undefined>(undefined);

// Sample course data (would eventually come from API or CMS)
export const SAMPLE_COURSES: Course[] = [
  {
    id: 'pr1-stabilize-snowflakes-to-diamonds',
    title: 'PR1: Stabilize - Turning Snowflakes into Diamonds',
    description: 'Learn to transform pressure into power and develop unshakeable resilience in the face of challenges.',
    pressureRoom: 1,
    duration: '8 weeks',
    lessons: ['Lesson 1: Introduction to Presence', 'Lesson 2: Breath Awareness', 'Lesson 3: Body Scan Meditation', 'Lesson 4: Present Moment Practice'],
    difficulty: 'Beginner',
    instructor: 'Michael Dugan'
  },
  {
    id: 'pr2-shift',
    title: 'PR2: Shift - Emotional Intelligence',
    description: 'Where your ego meets the mirror, and your identity upgrades.',
    pressureRoom: 2,
    duration: '4 weeks',
    lessons: ['Lesson 1: Understanding Emotions', 'Lesson 2: Emotional Regulation', 'Lesson 3: Empathy Development', 'Lesson 4: Emotional Mastery'],
    difficulty: 'Intermediate',
    instructor: 'Master Diamond'
  },
  {
    id: 'pr3-strengthen',
    title: 'PR3: Strengthen - Mental Clarity',
    description: 'Sharpen your mind and develop unshakeable focus and clarity.',
    pressureRoom: 3,
    duration: '5 weeks',
    lessons: ['Lesson 1: Cognitive Awareness', 'Lesson 2: Focus Training', 'Lesson 3: Mental Models', 'Lesson 4: Decision Making', 'Lesson 5: Clarity Mastery'],
    difficulty: 'Intermediate',
    instructor: 'Master Diamond'
  },
];

// Provider props
interface CourseProviderProps {
  children: ReactNode;
}

/**
 * CourseProvider component
 * Manages course enrollments, progress tracking, and activity logging
 */
export function CourseProvider({ children }: CourseProviderProps) {
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Load course data from localStorage on mount
  useEffect(() => {
    if (!user) return;

    try {
      const savedEnrollments = storage.getItem<CourseEnrollment[]>(STORAGE_KEYS.COURSE_PROGRESS) || [];
      setEnrollments(savedEnrollments);

      const savedActivities = storage.getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOG) || [];
      setActivities(savedActivities);
    } catch (error) {
      log.error('Error loading course data:', 'Context', error);
    }
  }, [user]);

  // Log activity function needs to be defined before useEffect
  // wrap logActivity in a useCallback
  const logActivity = useCallback((
    type: ActivityLog['type'],
    description: string,
    metadata: Record<string, unknown> = {}
  ) => {
    if (!user) return;


    const newActivity: ActivityLog = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type,
      timestamp: new Date().toISOString(),
      metadata,
      description,
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 100); // Keep last 100 activities
    setActivities(updatedActivities);
    storage.setItem(STORAGE_KEYS.ACTIVITY_LOG, updatedActivities);
  }, [user, activities]);

  // Listen for login events to log activity
  useEffect(() => {
    if (!user) return;

    const handleLogin = (event: CustomEvent) => {
      const { method } = event.detail;
      const methodName = method === 'test' ? 'test login' : `${method} authentication`;
      logActivity('login', `Logged in via ${methodName}`, { method });
    };

    window.addEventListener('user:login', handleLogin as EventListener);
    return () => window.removeEventListener('user:login', handleLogin as EventListener);
  }, [user, logActivity]);

  // Enroll in a course
  const enrollInCourse = (courseId: string) => {
    if (!user) return;

    const existingEnrollment = enrollments.find(e => e.courseId === courseId);
    if (existingEnrollment) return; // Already enrolled

    const newEnrollment: CourseEnrollment = {
      courseId,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      lastAccessedDate: new Date().toISOString(),
      lessonsCompleted: [],
      timeSpent: 0,
    };

    const updatedEnrollments = [...enrollments, newEnrollment];
    setEnrollments(updatedEnrollments);
    storage.setItem(STORAGE_KEYS.COURSE_PROGRESS, updatedEnrollments);

    // Log activity
    const course = SAMPLE_COURSES.find(c => c.id === courseId);
    logActivity('course_enrolled', `Enrolled in ${course?.title || courseId}`, { courseId });
  };

  // Update course progress
  const updateProgress = (courseId: string, updates: Partial<CourseEnrollment>) => {
    if (!user) return;

    const updatedEnrollments = enrollments.map(enrollment => {
      if (enrollment.courseId === courseId) {
        return {
          ...enrollment,
          ...updates,
          lastAccessedDate: new Date().toISOString(),
        };
      }
      return enrollment;
    });

    setEnrollments(updatedEnrollments);
    storage.setItem(STORAGE_KEYS.COURSE_PROGRESS, updatedEnrollments);
  };

  // Complete a lesson
  const completeLesson = (courseId: string, lessonId: string) => {
    if (!user) return;

    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment || enrollment.lessonsCompleted.includes(lessonId)) return;

    const course = SAMPLE_COURSES.find(c => c.id === courseId);
    if (!course) return;

    const updatedLessons = [...enrollment.lessonsCompleted, lessonId];
    const progress = Math.round((updatedLessons.length / course.lessons.length) * 100);

    updateProgress(courseId, {
      lessonsCompleted: updatedLessons,
      progress,
      currentLesson: lessonId,
    });

    logActivity('lesson_completed', `Completed ${lessonId} in ${course.title}`, { courseId, lessonId, progress });
  };

  // Complete a course
  const completeCourse = (courseId: string) => {
    if (!user) return;

    const course = SAMPLE_COURSES.find(c => c.id === courseId);
    if (!course) return;

    updateProgress(courseId, {
      completedDate: new Date().toISOString(),
      progress: 100,
    });

    logActivity('pr_completed', `Completed ${course.title}`, { courseId, pressureRoom: course.pressureRoom });
  };

  // Get enrollment for a course
  const getEnrollment = (courseId: string): CourseEnrollment | undefined => {
    return enrollments.find(e => e.courseId === courseId);
  };

  // Check if enrolled in a course
  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some(e => e.courseId === courseId);
  };

  // Get recent activities
  const getRecentActivities = (limit = 10): ActivityLog[] => {
    return activities.slice(0, limit);
  };

  const value: CourseContextValue = {
    enrollments,
    activities,
    enrollInCourse,
    updateProgress,
    completeLesson,
    completeCourse,
    logActivity,
    getEnrollment,
    isEnrolled,
    getRecentActivities,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

/**
 * Hook to access course context
 * Throws error if used outside CourseProvider
 */
export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
