import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for client-side error logging
 * Receives errors from client and forwards to Axiom
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

    // Send to Axiom
    const axiomToken = process.env.AXIOM_TOKEN;
    const axiomDataset = process.env.AXIOM_DATASET;

    if (!axiomToken || !axiomDataset) {
      console.error('Axiom not configured - error not logged:', errorEvent);
      return NextResponse.json(
        { error: 'Logging service not configured' },
        { status: 500 }
      );
    }

    // Send to Axiom ingest API
    const axiomResponse = await fetch(
      `https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            ...errorEvent,
            _time: errorEvent.timestamp,
            level: 'error',
            service: 'client',
          },
        ]),
      }
    );

    if (!axiomResponse.ok) {
      const errorText = await axiomResponse.text();
      console.error('Failed to send to Axiom:', errorText);
      return NextResponse.json(
        { error: 'Failed to log error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging endpoint failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
