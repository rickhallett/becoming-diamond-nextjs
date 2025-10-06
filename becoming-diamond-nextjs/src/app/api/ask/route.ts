import { askBookStreaming } from '@/lib/rag/claude-simple';
import { NextRequest } from 'next/server';
import { log } from '@/lib/logger';

export const runtime = 'nodejs'; // Use Node.js runtime for streaming

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return Response.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Check for API key (optional rate limiting/auth)
    // Uncomment if you want to require authentication
    // const apiKey = request.headers.get('x-api-key');
    // if (apiKey !== process.env.ADMIN_API_KEY) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Stream the response
    const stream = await askBookStreaming(question);

    // Convert Anthropic stream to ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
              if (chunk.delta.type === 'text_delta') {
                const text = chunk.delta.text;
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    await log.error('Error in /api/ask', 'API', error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process question',
      },
      { status: 500 }
    );
  }
}
