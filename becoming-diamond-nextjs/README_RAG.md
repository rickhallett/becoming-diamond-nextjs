# Claude RAG System Documentation

## Overview

This project now includes a simple RAG (Retrieval-Augmented Generation) system powered by Claude's API with prompt caching. Users can ask questions about the "Becoming Diamond" book through the DiamondMindAI chat interface.

## Architecture

### Simple Approach
Instead of building a complex RAG system with vector databases, chunking, and embeddings, we leverage:
- **Claude's 200K context window** - Fits the entire book content
- **Prompt caching** - Reduces costs by 90% for repeated queries
- **Streaming responses** - Better UX with real-time answers

### How It Works
1. User asks a question via `/app/app/chat`
2. Frontend sends POST request to `/api/ask`
3. API loads book content and creates a cached prompt
4. Claude generates an answer with citations
5. Response streams back to the user

## Setup Instructions

### 1. Book Content Already Configured

✅ The system is already configured to use your book "Turning Snowflakes into Diamonds" by Michael Dugan, located at:

```
docs/content/turning-snowflakes-into-diamonds.md
```

No action needed - the RAG system will automatically load this book content!

### 2. Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in (you mentioned having Claude Max, so you may already have access)
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your API key
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Important:** Never commit `.env.local` to Git - it's already in `.gitignore`

### 4. Test the System

```bash
# Start the dev server
npm run dev

# Visit http://localhost:3003/app/app/chat
# Click on suggested prompts or ask your own questions
```

## File Structure

```
/docs/content/
  turning-snowflakes-into-diamonds.md    # Your book content (2,078 lines)

/src/lib/rag/
  claude-simple.ts                        # Core RAG logic with Claude API

/src/app/api/ask/
  route.ts                                # API endpoint for questions

/src/app/app/chat/
  page.tsx                                # Chat UI (updated to use RAG)
```

## Cost Analysis

### With Prompt Caching (Current Implementation)

**First Request:**
- Book content: ~40K tokens (written to cache @ $0.30/MTok) = **$0.012**
- Response generation: ~500 tokens @ $3/MTok = **$0.0015**
- **Total: ~$0.014 per first request**

**Subsequent Requests (within 5 minutes):**
- Book content: ~40K tokens (read from cache @ $0.03/MTok) = **$0.0012**
- Response generation: ~500 tokens @ $3/MTok = **$0.0015**
- **Total: ~$0.0027 per cached request**

**Monthly Estimate (100 queries/day, 80% cache hit rate):**
- 20 cold requests × $0.014 = $0.28
- 80 cached requests × $0.0027 = $0.22
- **Total per day: ~$0.50**
- **Total per month: ~$15**

### Comparison to Original Spec

| Approach | Monthly Cost | Complexity |
|----------|--------------|------------|
| **Claude RAG (current)** | ~$15/mo | Very Low |
| Original RAG spec | ~$27-50/mo | Very High |
| Hosted RAG (Markprompt, etc.) | ~$50-100/mo | Low |

## Usage Examples

### Ask Specific Questions
```
"What is the Diamond Transformation Roadmap?"
"Explain snowflakes vs diamonds"
"How do I stabilize under pressure?"
```

### Request Summaries
```
"Summarize the Preface"
"What are the key stages in Part 1?"
```

### Compare Concepts
```
"What makes humans irreplaceable in the AI age?"
"How does identity transformation work?"
```

### Get Citations
Claude will automatically cite specific chapter sections and headings from "Turning Snowflakes into Diamonds" based on the book content.

## Advanced: Real-Time Streaming (Future Enhancement)

The current implementation loads the full response before displaying. To show text as it streams:

```typescript
// In chat/page.tsx - handleSubmit()
const response = await fetch('/api/ask', { /* ... */ });
const reader = response.body?.getReader();

// Create a temporary message ID
const tempMessageId = Date.now().toString();
addMessage('', 'assistant'); // Empty message

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Update the message incrementally
  updateMessage(tempMessageId, chunk); // You'd need to implement this
}
```

## Troubleshooting

### "Book content not found" error
- Ensure `docs/content/turning-snowflakes-into-diamonds.md` exists
- Check file permissions (should be readable)

### "ANTHROPIC_API_KEY is not defined" error
- Verify `.env.local` exists in the project root
- Confirm the key is set: `ANTHROPIC_API_KEY=sk-ant-...`
- Restart your dev server after adding the key

### Slow responses
- First request is slower (cache creation)
- Subsequent requests should be fast (<3 seconds)
- Check your internet connection

### High costs
- Monitor usage at [console.anthropic.com](https://console.anthropic.com)
- Cache TTL is 5 minutes - frequent usage within this window is cheap
- Consider rate limiting if costs spike (see below)

## Rate Limiting (Optional)

To prevent abuse, you can add API key authentication:

```typescript
// In /api/ask/route.ts
const apiKey = request.headers.get('x-api-key');
if (apiKey !== process.env.ADMIN_API_KEY) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Then set `ADMIN_API_KEY` in `.env.local` and add it to frontend requests:

```typescript
// In chat/page.tsx
fetch('/api/ask', {
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY,
  },
  // ...
})
```

**Note:** This requires making the key public (via `NEXT_PUBLIC_`). For production, use proper authentication (NextAuth.js, etc.)

## Next Steps

### Immediate Improvements
1. ✅ **Book content is configured** - "Turning Snowflakes into Diamonds" is ready
2. **Test with real questions** to validate answer quality
3. **Monitor costs** in the Anthropic console

### Future Enhancements
1. **Real-time streaming UI** - Show text as it generates
2. **Citation links** - Parse page numbers and create clickable references
3. **Multi-book support** - Allow selecting different books
4. **Conversation memory** - Keep chat context across messages
5. **Export conversations** - Download chat history

### If You Outgrow This System
Switch to the full RAG spec with:
- Vector database (Qdrant, Pinecone)
- Chunking and embeddings
- Semantic search
- Re-ranking

But only if:
- You have 10+ books (>500 pages total)
- Query volume exceeds 1,000/day
- Need offline operation
- Require sub-second responses

## Credits

Built with:
- [Anthropic Claude API](https://www.anthropic.com/api)
- [Next.js 15](https://nextjs.org)
- [Prompt Caching](https://docs.anthropic.com/claude/docs/prompt-caching)
