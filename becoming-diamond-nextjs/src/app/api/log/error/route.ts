import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/axiom-logger';

/**
 * API endpoint for client-side error logging
 * Receives errors from client and forwards to Axiom
 *
 * This endpoint allows client-side components (Error Boundary, etc.)
 * to log errors to Axiom without exposing credentials to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const errorEvent = await request.json();

    // Validate required fields
    if (!errorEvent.error_message || !errorEvent.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log to Axiom using centralized logger
    await log.error('Client-side error', {
      component: errorEvent.component || 'Unknown',
      source: 'client',
      error_type: errorEvent.error_type || 'ClientError',
      error_message: errorEvent.error_message,
      error_stack: errorEvent.error_stack,
      component_stack: errorEvent.component_stack,
      url: errorEvent.url,
      user_agent: errorEvent.user_agent,
      timestamp: errorEvent.timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't use log.error here to avoid potential infinite loops
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
