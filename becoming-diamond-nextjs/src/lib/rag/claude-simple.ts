import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Load book content (cached at module load time)
let bookContent: string | null = null;

function getBookContent(): string {
  if (bookContent) return bookContent;

  const bookPath = path.join(process.cwd(), 'docs/content/turning-snowflakes-into-diamonds.md');

  if (!fs.existsSync(bookPath)) {
    throw new Error(
      'Book content not found. Please ensure docs/content/turning-snowflakes-into-diamonds.md exists'
    );
  }

  bookContent = fs.readFileSync(bookPath, 'utf-8');
  return bookContent;
}

export interface AskBookResult {
  answer: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

export async function askBook(question: string): Promise<AskBookResult> {
  const content = getBookContent();

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: `You are an expert on the book "Turning Snowflakes into Diamonds" by Michael Dugan.

Answer questions based ONLY on the book content provided below.
Always cite specific chapter sections or headings when making claims.
If the answer isn't clearly in the book, say so and suggest what related topics the book does cover.
Be concise but thorough. Structure your answers clearly.
The book focuses on identity transformation, nervous system regulation, and high-performance under pressure.`,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: `BOOK CONTENT:\n\n${content}`,
        cache_control: { type: 'ephemeral' }
      }
    ],
    messages: [{ role: 'user', content: question }],
  });

  return {
    answer: message.content[0].type === 'text' ? message.content[0].text : '',
    usage: {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      cache_creation_input_tokens: message.usage.cache_creation_input_tokens,
      cache_read_input_tokens: message.usage.cache_read_input_tokens,
    },
  };
}

export async function askBookStreaming(question: string) {
  const content = getBookContent();

  return anthropic.messages.stream({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: `You are an expert on the book "Turning Snowflakes into Diamonds" by Michael Dugan.

Answer questions based ONLY on the book content provided below.
Always cite specific chapter sections or headings when making claims.
If the answer isn't clearly in the book, say so and suggest what related topics the book does cover.
Be concise but thorough. Structure your answers clearly.
The book focuses on identity transformation, nervous system regulation, and high-performance under pressure.`,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: `BOOK CONTENT:\n\n${content}`,
        cache_control: { type: 'ephemeral' }
      }
    ],
    messages: [{ role: 'user', content: question }],
  });
}
