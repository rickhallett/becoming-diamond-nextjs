"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { logSync as log } from '@/lib/logger';

// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
  currentPR: number;
  completedPRs: number[];
  level: string;
  xp: number;
  streak: number;
}

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  loginMethod?: 'github' | 'google' | 'email' | 'test';
  loginTimestamp?: number;
}

// Context value interface
interface UserContextValue {
  user: UserProfile | null;
  auth: AuthState;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  login: (userId: string, method: AuthState['loginMethod']) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// Create context with undefined default
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Default user profile template
const createDefaultProfile = (userId: string): UserProfile => ({
  id: userId,
  name: 'Diamond Member',
  email: '',
  avatar: '/profile-placeholder.webp',
  bio: 'On a journey to becoming diamond.',
  location: '',
  website: '',
  joinedDate: new Date().toISOString(),
  currentPR: 1,
  completedPRs: [],
  level: 'Initiate',
  xp: 0,
  streak: 0,
});

// Provider props
interface UserProviderProps {
  children: ReactNode;
}

/**
 * UserProvider component
 * Manages user profile and authentication state with database persistence
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Fetch profile from database
  const fetchProfile = React.useCallback(async () => {
    if (!session?.user?.id) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.profile);

      // Update auth state
      const authState: AuthState = {
        isAuthenticated: true,
        userId: data.profile.id,
        loginMethod: 'email', // Could be determined from session
        loginTimestamp: Date.now(),
      };
      setAuth(authState);
    } catch (error) {
      log.error('Error fetching profile:', 'Context', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Sync NextAuth session with UserContext and fetch profile from database
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      // Check for test auth in localStorage (development mode)
      const storedAuth = storage.getItem<AuthState>(STORAGE_KEYS.USER_AUTH);
      const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);

      if (storedAuth && storedProfile && storedAuth.isAuthenticated) {
        // Test auth mode - use localStorage data
        setAuth(storedAuth);
        setUser(storedProfile);
        setIsLoading(false);
        return;
      }

      // No session and no test auth - truly unauthenticated
      setUser(null);
      setAuth({
        isAuthenticated: false,
        userId: null,
      });
      setIsLoading(false);
      return;
    }

    // Fetch profile from database when session is ready (production auth)
    fetchProfile();
  }, [status, fetchProfile]);

  // Update user profile with database persistence
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    // Optimistic update
    const updatedProfile = { ...user, ...updates };
    setUser(updatedProfile);

    // Test mode - update localStorage only
    if (auth.loginMethod === 'test') {
      storage.setItem(STORAGE_KEYS.USER_PROFILE, updatedProfile);
      return;
    }

    // Production mode - update database via API
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh from server to ensure consistency
      await fetchProfile();
    } catch (error) {
      log.error('Error updating profile:', 'Context', error);
      // Revert optimistic update
      await fetchProfile();
    }
  };

  // Login user
  const login = (userId: string, method: AuthState['loginMethod'] = 'test') => {
    const authState: AuthState = {
      isAuthenticated: true,
      userId,
      loginMethod: method,
      loginTimestamp: Date.now(),
    };

    setAuth(authState);
    storage.setItem(STORAGE_KEYS.USER_AUTH, authState);

    // Load or create user profile
    const existingProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    if (existingProfile && existingProfile.id === userId) {
      setUser(existingProfile);
    } else {
      const newProfile = createDefaultProfile(userId);
      setUser(newProfile);
      storage.setItem(STORAGE_KEYS.USER_PROFILE, newProfile);
    }

    // Log login activity (will be handled by CourseContext)
    // This is deferred to avoid circular dependency
    window.dispatchEvent(new CustomEvent('user:login', { detail: { userId, method } }));
  };

  // Logout user
  const logout = () => {
    setAuth({
      isAuthenticated: false,
      userId: null,
    });
    setUser(null);
    storage.removeItem(STORAGE_KEYS.USER_AUTH);
    storage.removeItem(STORAGE_KEYS.USER_PROFILE);
  };

  // Refresh profile - handles both test mode and production mode
  const refreshProfile = async () => {
    // Test mode - reload from localStorage
    if (auth.loginMethod === 'test') {
      const storedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
      if (storedProfile) {
        setUser(storedProfile);
      }
      return;
    }

    // Production mode - fetch from API
    await fetchProfile();
  };

  const value: UserContextValue = {
    user,
    auth,
    isLoading,
    updateProfile,
    refreshProfile,
    login,
    logout,
    isLoggedIn: auth.isAuthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook to access user context
 * Throws error if used outside UserProvider
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
