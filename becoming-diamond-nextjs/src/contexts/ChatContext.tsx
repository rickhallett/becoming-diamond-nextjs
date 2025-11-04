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

  // Fetch chat sessions from database or fallback to localStorage
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        // Try API first
        const response = await fetch('/api/chat');
        if (response.ok) {
          const data = await response.json();
          setSessions(data.sessions || []);

          // Load the most recent session as current (if any)
          if (data.sessions && data.sessions.length > 0) {
            const mostRecent = data.sessions[0]; // Already sorted by API
            setCurrentSession(mostRecent);
          }
        } else {
          // Fallback to localStorage
          const savedSessions = storage.getItem<ChatSession[]>(STORAGE_KEYS.CHAT_SESSIONS) || [];
          setSessions(savedSessions);

          if (savedSessions.length > 0) {
            const mostRecent = savedSessions.sort((a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )[0];
            setCurrentSession(mostRecent);
          }
        }
      } catch (error) {
        log.error('Error loading chat sessions:', 'Context', error);
        // Fallback to localStorage on error
        const savedSessions = storage.getItem<ChatSession[]>(STORAGE_KEYS.CHAT_SESSIONS) || [];
        setSessions(savedSessions);

        if (savedSessions.length > 0) {
          const mostRecent = savedSessions.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setCurrentSession(mostRecent);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
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
  const createSession = async (title?: string) => {
    if (!user) return;

    const now = new Date().toISOString();
    const sessionTitle = title || 'New Conversation';

    try {
      // Try API first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: sessionTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSession(data.session);

        const updatedSessions = [data.session, ...sessions];
        if (updatedSessions.length > MAX_SESSIONS) {
          updatedSessions.splice(MAX_SESSIONS);
        }
        setSessions(updatedSessions);
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      log.error('Error creating session, using localStorage:', 'Context', error);
      // Fallback to localStorage
      const newSession: ChatSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: sessionTitle,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };

      setCurrentSession(newSession);

      const updatedSessions = [newSession, ...sessions];
      if (updatedSessions.length > MAX_SESSIONS) {
        updatedSessions.splice(MAX_SESSIONS);
      }

      setSessions(updatedSessions);
      storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);
    }
  };

  // Load an existing session
  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  // Add a message to the current session
  const addMessage = async (content: string, role: 'user' | 'assistant') => {
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

    // Optimistic update
    setCurrentSession(updatedSession);

    try {
      // Try API first
      const requests = [];

      // Update title if it changed
      if (updatedTitle !== currentSession.title) {
        requests.push(
          fetch('/api/chat', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: currentSession.id, title: updatedTitle }),
          })
        );
      }

      // Add message
      requests.push(
        fetch('/api/chat', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSession.id,
            message: { role, content },
          }),
        })
      );

      await Promise.all(requests);
    } catch (error) {
      log.error('Error adding message, using localStorage:', 'Context', error);
      // Fallback to localStorage
      const updatedSessions = sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );

      if (!sessions.find(s => s.id === updatedSession.id)) {
        updatedSessions.unshift(updatedSession);
      }

      setSessions(updatedSessions);
      storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    if (!user) return;

    // Optimistic update
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);

    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }

    try {
      // Try API first
      await fetch(`/api/chat?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      log.error('Error deleting session, using localStorage:', 'Context', error);
      // Fallback to localStorage
      storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);
    }
  };

  // Clear current session (start fresh without creating new)
  const clearCurrentSession = () => {
    setCurrentSession(null);
  };

  // Update session title manually
  const updateSessionTitle = async (sessionId: string, title: string) => {
    if (!user) return;

    const now = new Date().toISOString();
    const updatedSessions = sessions.map(s =>
      s.id === sessionId ? { ...s, title, updatedAt: now } : s
    );

    // Optimistic update
    setSessions(updatedSessions);

    if (currentSession?.id === sessionId) {
      setCurrentSession({ ...currentSession, title });
    }

    try {
      // Try API first
      await fetch('/api/chat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, title }),
      });
    } catch (error) {
      log.error('Error updating session title, using localStorage:', 'Context', error);
      // Fallback to localStorage
      storage.setItem(STORAGE_KEYS.CHAT_SESSIONS, updatedSessions);
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
