"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';

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
  currentGateway: number;
  completedGateways: number[];
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
  updateProfile: (updates: Partial<UserProfile>) => void;
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
  avatar: '/kai_profile.jpeg',
  bio: 'On a journey to becoming diamond.',
  location: '',
  website: '',
  joinedDate: new Date().toISOString(),
  currentGateway: 1,
  completedGateways: [],
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
 * Manages user profile and authentication state with localStorage persistence
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load auth state
        const savedAuth = storage.getItem<AuthState>(STORAGE_KEYS.USER_AUTH);
        if (savedAuth && savedAuth.isAuthenticated) {
          setAuth(savedAuth);

          // Load user profile
          const savedProfile = storage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
          if (savedProfile) {
            setUser(savedProfile);
          } else if (savedAuth.userId) {
            // Create default profile if auth exists but no profile
            const defaultProfile = createDefaultProfile(savedAuth.userId);
            setUser(defaultProfile);
            storage.setItem(STORAGE_KEYS.USER_PROFILE, defaultProfile);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update user profile
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;

    const updatedProfile = { ...user, ...updates };
    setUser(updatedProfile);
    storage.setItem(STORAGE_KEYS.USER_PROFILE, updatedProfile);
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

  const value: UserContextValue = {
    user,
    auth,
    isLoading,
    updateProfile,
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
