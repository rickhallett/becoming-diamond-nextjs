/**
 * Next.js instrumentation for server-side error tracking
 * This runs once when the server starts
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Capture unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      // Send to Axiom
      sendServerErrorToAxiom({
        error_type: 'UnhandledRejection',
        error_message: reason instanceof Error ? reason.message : String(reason),
        error_stack: reason instanceof Error ? reason.stack : undefined,
        promise: String(promise),
        source: 'process.unhandledRejection',
      }).catch(() => {
        // Silent catch - errors already logged to Axiom
      });
    });

    // Capture uncaught exceptions
    process.on('uncaughtException', (error) => {
      // Send to Axiom
      sendServerErrorToAxiom({
        error_type: error.name || 'UncaughtException',
        error_message: error.message,
        error_stack: error.stack,
        source: 'process.uncaughtException',
      }).catch(() => {
        // Silent catch - errors already logged to Axiom
      });
    });
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
      return;
    }

    await fetch(
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
  } catch {
    // Silent catch - avoid console spam
  }
}
