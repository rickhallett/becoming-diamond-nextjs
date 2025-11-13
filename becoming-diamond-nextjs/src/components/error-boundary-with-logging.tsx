'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';
import { log } from '@axiomhq/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ErrorBoundaryWithLogging({ children, fallback }: Props) {
  const handleError = async (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to Axiom
    await log.error('Client component error', {
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <ErrorBoundary onError={handleError} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
