import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to test Axiom connection
 * GET /api/log/test
 */
export async function GET() {
  console.error('[DIAGNOSTIC] Testing Axiom connection');

  const axiomToken = process.env.AXIOM_TOKEN;
  const axiomDataset = process.env.AXIOM_DATASET;

  if (!axiomToken || !axiomDataset) {
    console.error('[DIAGNOSTIC] Axiom not configured');
    return NextResponse.json(
      {
        success: false,
        error: 'Axiom not configured',
        axiomTokenPresent: !!axiomToken,
        axiomDatasetPresent: !!axiomDataset,
      },
      { status: 500 }
    );
  }

  console.error('[DIAGNOSTIC] Axiom configured:', {
    dataset: axiomDataset,
    tokenLength: axiomToken.length,
  });

  try {
    const testEvent = {
      _time: new Date().toISOString(),
      level: 'info',
      service: 'diagnostic',
      message: 'Axiom connection test',
      test_id: `test-${Date.now()}`,
    };

    console.error('[DIAGNOSTIC] Sending test event to Axiom');

    const response = await fetch(
      `https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([testEvent]),
      }
    );

    const responseText = await response.text();

    console.error('[DIAGNOSTIC] Axiom response:', {
      status: response.status,
      ok: response.ok,
      body: responseText,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Axiom request failed',
          status: response.status,
          response: responseText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Axiom connection successful',
      dataset: axiomDataset,
      testEvent,
      axiomResponse: responseText,
    });
  } catch (error) {
    console.error('[DIAGNOSTIC] Axiom test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Exception during Axiom test',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
