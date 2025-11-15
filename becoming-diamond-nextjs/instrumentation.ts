/**
 * Next.js instrumentation for server-side error tracking
 * This runs once when the server starts
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting - error tracking enabled');

    // Capture unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[UNHANDLED REJECTION]', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        promise: String(promise),
      });

      // Send to Axiom
      sendServerErrorToAxiom({
        error_type: 'UnhandledRejection',
        error_message: reason instanceof Error ? reason.message : String(reason),
        error_stack: reason instanceof Error ? reason.stack : undefined,
        source: 'process.unhandledRejection',
      }).catch(console.error);
    });

    // Capture uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('[UNCAUGHT EXCEPTION]', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Send to Axiom
      sendServerErrorToAxiom({
        error_type: error.name || 'UncaughtException',
        error_message: error.message,
        error_stack: error.stack,
        source: 'process.uncaughtException',
      }).catch(console.error);
    });

    console.log('[Instrumentation] Server error handlers registered');
  }
}

interface ServerErrorEvent {
  error_type: string;
  error_message: string;
  error_stack?: string;
  source: string;
  [key: string]: unknown;
}

async function sendServerErrorToAxiom(event: ServerErrorEvent): Promise<void> {
  try {
    const axiomToken = process.env.AXIOM_TOKEN;
    const axiomDataset = process.env.AXIOM_DATASET;

    if (!axiomToken || !axiomDataset) {
      console.error('[Axiom] Not configured - skipping error log');
      return;
    }

    const response = await fetch(
      `https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            ...event,
            _time: new Date().toISOString(),
            level: 'error',
            service: 'server',
            environment: process.env.NODE_ENV,
          },
        ]),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Axiom] Failed to send error:', errorText);
    } else {
      console.log('[Axiom] Server error logged successfully');
    }
  } catch (error) {
    console.error('[Axiom] Failed to send server error:', error);
  }
}
