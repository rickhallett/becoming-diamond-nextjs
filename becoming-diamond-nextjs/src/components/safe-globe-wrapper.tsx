'use client';

import { Component, ReactNode } from 'react';

interface SafeGlobeWrapperProps {
  children: ReactNode;
}

interface SafeGlobeWrapperState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for WebGL/Three.js Globe component
 * Prevents the entire app from crashing if WebGL fails on mobile
 */
export class SafeGlobeWrapper extends Component<SafeGlobeWrapperProps, SafeGlobeWrapperState> {
  constructor(props: SafeGlobeWrapperProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SafeGlobeWrapperState {
    // Check if this is a WebGL-related error
    const isWebGLError =
      error.message.includes('WebGL') ||
      error.message.includes('getShaderPrecisionFormat') ||
      error.message.includes('getContext') ||
      error.message.includes('THREE');

    if (isWebGLError) {
      return { hasError: true, error };
    }

    // Re-throw non-WebGL errors
    throw error;
  }

  componentDidCatch(error: Error) {
    // Log to console for debugging
    console.error('[Globe Error]', error);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for WebGL failures
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg border border-white/10">
          <div className="text-center p-8 max-w-md">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Global Community
            </h3>
            <p className="text-gray-400 text-sm">
              Thousands of leaders across six continents are transforming pressure into clarity.
              The movement is growing.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
