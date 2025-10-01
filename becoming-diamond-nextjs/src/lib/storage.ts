/**
 * Type-safe localStorage utility with SSR safety
 * Handles serialization, deserialization, and graceful fallbacks
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export interface StorageOptions {
  expiresIn?: number; // Time in milliseconds until item expires
}

interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

/**
 * Type-safe localStorage wrapper with SSR safety and expiration support
 */
export const storage = {
  /**
   * Get an item from localStorage
   * Returns null if item doesn't exist, is expired, or if not in browser
   */
  getItem<T>(key: string): T | null {
    if (!isBrowser) return null;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item) as StorageItem<T>;

      // Check expiration
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  /**
   * Set an item in localStorage
   * Returns true if successful, false otherwise
   */
  setItem<T>(key: string, value: T, options?: StorageOptions): boolean {
    if (!isBrowser) return false;

    try {
      const item: StorageItem<T> = {
        value,
        expiresAt: options?.expiresIn
          ? Date.now() + options.expiresIn
          : undefined,
      };

      window.localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      return false;
    }
  },

  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): void {
    if (!isBrowser) return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    if (!isBrowser) return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if a key exists in localStorage
   */
  hasItem(key: string): boolean {
    if (!isBrowser) return false;

    return window.localStorage.getItem(key) !== null;
  },

  /**
   * Get all keys from localStorage
   */
  keys(): string[] {
    if (!isBrowser) return [];

    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },
};

/**
 * Storage keys used throughout the application
 * Centralized to avoid typos and make refactoring easier
 */
export const STORAGE_KEYS = {
  USER_PROFILE: 'bd_user_profile',
  USER_AUTH: 'bd_user_auth',
  COURSE_PROGRESS: 'bd_course_progress',
  COURSE_ENROLLMENTS: 'bd_course_enrollments',
  CHAT_CONVERSATIONS: 'bd_chat_conversations',
  CHAT_SESSIONS: 'bd_chat_sessions',
  USER_ACTIVITY: 'bd_user_activity',
  ACTIVITY_LOG: 'bd_activity_log',
  USER_PREFERENCES: 'bd_user_preferences',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
