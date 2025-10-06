"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useUser } from './UserContext';
import { logSync as log } from '@/lib/logger';

// Chat message interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Chat session interface
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Context value interface
interface ChatContextValue {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  createSession: (title?: string) => void;
  loadSession: (sessionId: string) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  deleteSession: (sessionId: string) => void;
  clearCurrentSession: () => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
}

// Create context
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Maximum number of sessions to keep (LRU eviction)
const MAX_SESSIONS = 10;

// Provider props
interface ChatProviderProps {
  children: ReactNode;
}

/**
 * ChatProvider component
 * Manages chat sessions and message persistence with localStorage
 */
export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useUser();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const savedSessions = storage.getItem<ChatSession[]>(STORAGE_KEYS.CHAT_SESSIONS) || [];
      setSessions(savedSessions);

      // Load the most recent session as current (if any)
      if (savedSessions.length > 0) {
        const mostRecent = savedSessions.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        setCurrentSession(mostRecent);
      }
    } catch (error) {
      log.error('Error loading chat sessions:', 'Context', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Generate a title from the first user message
  const generateTitle = (firstMessage: string): string => {
    const maxLength = 40;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.substring(0, maxLength) + '...';
  };

  // Create a new chat session
  const createSession = (title?: string) => {
    if (!user) return;

    const now = new Date().toISOString();
    const newSession: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title || 'New Conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    setCurrentSession(newSession);

    // Add to sessions list (will be saved when first message is added)
    const updatedSessions = [newSession, ...sessions];

    // Enforce MAX_SESSIONS limit with LRU eviction
    if (updatedSessions.length > MAX_SESSIONS) {
      // Remove oldest session (by updatedAt)
      updatedSessions.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      updatedSessions.splice(MAX_SESSIONS);
    }

    setSessions(updatedSessions);
    storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);
  };

  // Load an existing session
  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  // Add a message to the current session
  const addMessage = (content: string, role: 'user' | 'assistant') => {
    if (!user || !currentSession) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentSession.messages, newMessage];

    // Auto-generate title from first user message
    let updatedTitle = currentSession.title;
    if (currentSession.messages.length === 0 && role === 'user') {
      updatedTitle = generateTitle(content);
    }

    const updatedSession: ChatSession = {
      ...currentSession,
      title: updatedTitle,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    setCurrentSession(updatedSession);

    // Update sessions list
    const updatedSessions = sessions.map(s =>
      s.id === updatedSession.id ? updatedSession : s
    );

    // If this was a new session that didn't exist in the list yet, add it
    if (!sessions.find(s => s.id === updatedSession.id)) {
      updatedSessions.unshift(updatedSession);
    }

    setSessions(updatedSessions);
    storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    if (!user) return;

    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);

    // If deleted session was current, clear it
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  // Clear current session (start fresh without creating new)
  const clearCurrentSession = () => {
    setCurrentSession(null);
  };

  // Update session title manually
  const updateSessionTitle = (sessionId: string, title: string) => {
    if (!user) return;

    const updatedSessions = sessions.map(s =>
      s.id === sessionId ? { ...s, title, updatedAt: new Date().toISOString() } : s
    );

    setSessions(updatedSessions);
    storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);

    if (currentSession?.id === sessionId) {
      setCurrentSession({ ...currentSession, title });
    }
  };

  const value: ChatContextValue = {
    currentSession,
    sessions,
    isLoading,
    createSession,
    loadSession,
    addMessage,
    deleteSession,
    clearCurrentSession,
    updateSessionTitle,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * Hook to access chat context
 * Throws error if used outside ChatProvider
 */
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
