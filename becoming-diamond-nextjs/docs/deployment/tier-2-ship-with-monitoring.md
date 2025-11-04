# Tier 2: Ship with Monitoring - Deployment Guide

**Confidence Level:** 🟡 75-89%
**Features:** 4 features requiring external service configuration
**Risk Level:** Medium
**Estimated Setup Time:** 1-2 weeks (including service configuration)

---

## Features Included

### 1. Settings Management (88% Confidence)
**Tests:** 43 E2E tests (all passing)
**Dependencies:** None (localStorage only)
**Risk:** No backend persistence, settings lost on browser clear

### 2. Video Course Playback (85% Confidence)
**Tests:** 8 E2E tests (4 active, 4 pending)
**Dependencies:** Bunny Stream (not configured)
**Risk:** Video streaming not validated, token API mocked

### 3. DiamondMindAI Chat Interface (82% Confidence)
**Tests:** 53 E2E tests + 16 component tests
**Dependencies:** AI backend (not configured)
**Risk:** Real AI responses not tested, potential cost overruns

### 4. Authentication System (78% Confidence)
**Tests:** 13 E2E tests (6 active, 7 pending)
**Dependencies:** Email service (partial), OAuth (not configured)
**Risk:** Email delivery not validated, magic links untested

---

## Pre-Deployment Requirements

### Critical: Configure External Services First

**DO NOT deploy Tier 2 features until:**
1. ✅ Bunny Stream account created and configured
2. ✅ AI backend endpoint deployed and tested
3. ✅ Email service (Resend) fully configured for auth
4. ✅ OAuth providers (GitHub, Google) registered and tested

**Deployment Order:**
1. Week 1: Settings (low risk, no dependencies)
2. Week 2: Video + Chat (requires service configuration)
3. Week 3: Authentication (requires email + OAuth)

---

## Feature 1: Settings Management

### Deployment Readiness: ✅ Ready (with documentation)

**Confidence:** 88%
**Risk:** Low (localStorage only)
**Dependencies:** None

### Pre-Deployment Steps

**1. Document localStorage Limitations**

Create user-facing documentation explaining settings persistence:

```markdown
# Settings & Preferences

## How Settings Work

Your settings are stored locally in your browser. This means:
- ✅ Settings persist between sessions on the same device/browser
- ❌ Settings do NOT sync across devices
- ❌ Clearing browser data will reset your settings

## Recommended Practice

If you use multiple devices:
1. Configure settings on your primary device
2. Take a screenshot of your preferences
3. Manually replicate on other devices

## Future Enhancement

We're planning to add cloud sync for settings in a future update.
This will allow your preferences to follow you across devices.
```

**2. Add localStorage Quota Warning**

```typescript
// src/app/app/settings/page.tsx

useEffect(() => {
  // Check localStorage availability
  const testKey = '__storage_test__';
  try {
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
  } catch (e) {
    // Show warning to user
    setStorageError('Your browser settings prevent saving preferences. Please enable localStorage.');
  }

  // Check quota
  const used = new Blob(Object.values(localStorage)).size;
  const quota = 5 * 1024 * 1024; // 5 MB
  if (used / quota > 0.9) {
    setStorageWarning('Browser storage is nearly full. Some settings may not save.');
  }
}, []);
```

**3. Implement Settings Export/Import**

```typescript
// Allow users to backup their settings
const exportSettings = () => {
  const settings = localStorage.getItem('user_settings');
  const blob = new Blob([settings || '{}'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `becoming-diamond-settings-${new Date().toISOString()}.json`;
  a.click();
};

const importSettings = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const settings = e.target?.result as string;
    localStorage.setItem('user_settings', settings);
    location.reload(); // Refresh to apply
  };
  reader.readAsText(file);
};
```

### Deployment Steps

```bash
# 1. Deploy settings documentation
git add docs/user-guides/settings.md
git commit -m "docs: add settings persistence documentation"

# 2. Deploy localStorage enhancements
git add src/app/app/settings/
git commit -m "feat(settings): add storage checks and export/import"

# 3. Push to main
git push origin main
```

### Post-Deployment Monitoring

**Metrics to Track:**
- Settings save success rate (localStorage errors)
- Settings export usage (track download clicks)
- User complaints about lost settings

**Monitoring Setup:**
```typescript
// Add error tracking
try {
  localStorage.setItem(key, value);
} catch (error) {
  // Log to monitoring service
  console.error('[Settings] Save failed', { key, error: error.message });
  // Track in analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'settings_save_error', {
      error_type: error.name,
      storage_used: new Blob(Object.values(localStorage)).size
    });
  }
}
```

### Success Criteria

- [ ] Settings save/load without errors (99%+ success rate)
- [ ] Export/import functionality working
- [ ] User documentation published
- [ ] < 1% localStorage quota errors
- [ ] No user complaints about data loss

---

## Feature 2: Video Course Playback

### Deployment Readiness: ⚠️ Requires Bunny Stream Setup

**Confidence:** 85%
**Risk:** Medium (untested video streaming)
**Dependencies:** Bunny Stream account + API configuration

### Pre-Deployment Requirements

**1. Create Bunny Stream Account**

```bash
# 1. Go to https://bunny.net
# 2. Sign up for Bunny Stream
# 3. Create video library
# 4. Copy credentials:
#    - Library ID
#    - API Key
#    - CDN Hostname
```

**2. Upload Test Video**

```bash
# Upload via Bunny dashboard
# 1. Go to Stream → Libraries → Your Library
# 2. Click "Upload Video"
# 3. Upload a test video (e.g., "Introduction.mp4")
# 4. Wait for encoding (1080p, 720p, 480p)
# 5. Copy video GUID
```

**3. Configure Environment Variables**

```bash
# Add to Vercel environment variables
BUNNY_LIBRARY_ID=<your-library-id>
BUNNY_API_KEY=<your-api-key>
BUNNY_CDN_HOSTNAME=<your-cdn-hostname>.b-cdn.net
```

**4. Implement Video Token API**

```typescript
// src/app/api/video/[videoId]/token/route.ts

export async function GET(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  // TODO: Verify user authentication
  // const session = await getSession();
  // if (!session) return new Response('Unauthorized', { status: 401 });

  const videoId = params.videoId;

  // Generate signed token (24-hour expiry)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tokenExpiry = Math.floor(expiresAt.getTime() / 1000);

  const signatureData = `${process.env.BUNNY_LIBRARY_ID}${process.env.BUNNY_API_KEY}${videoId}${tokenExpiry}`;
  const token = createHash('sha256').update(signatureData).digest('hex');

  const streamUrl = `https://${process.env.BUNNY_CDN_HOSTNAME}/${videoId}/playlist.m3u8?token=${token}&expires=${tokenExpiry}`;

  return Response.json({
    streamUrl,
    token,
    expiresAt: expiresAt.toISOString(),
  });
}
```

**5. Implement VideoPlayer Component**

```typescript
// src/components/VideoPlayer.tsx

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  poster?: string;
  onProgress?: (progress: number) => void;
}

export function VideoPlayer({
  videoId,
  autoplay = false,
  poster,
  onProgress
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Fetch token and stream URL
    fetch(`/api/video/${videoId}/token`)
      .then(res => res.json())
      .then(({ streamUrl }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current!);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoplay) videoRef.current?.play();
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            setError(`Video loading failed: ${data.details}`);
          });
          return () => hls.destroy();
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = streamUrl;
          setLoading(false);
        } else {
          setError('Video playback not supported in this browser');
        }
      })
      .catch(err => setError(`Failed to load video: ${err.message}`));
  }, [videoId, autoplay]);

  // Track progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onProgress) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      onProgress(progress);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onProgress]);

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-4 rounded">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-white">Loading video...</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        poster={poster}
        className="w-full rounded-lg"
      />
    </div>
  );
}
```

**6. Install Dependencies**

```bash
npm install hls.js
npm install --save-dev @types/hls.js
```

### Testing Steps

**1. Test Video Upload**
```bash
# Upload test video via Bunny dashboard
# Verify encoding completes for all qualities
# Copy video GUID for testing
```

**2. Test Token Generation**
```bash
# Test API endpoint
curl https://becomingdiamond.com/api/video/test-video-guid/token

# Expected response:
# {
#   "streamUrl": "https://xxx.b-cdn.net/xxx/playlist.m3u8?token=...&expires=...",
#   "token": "abc123...",
#   "expiresAt": "2025-11-05T..."
# }
```

**3. Test Video Playback**
```bash
# Run E2E tests
npx playwright test course-playback.spec.ts

# Expected: All 8 tests passing (no more skips)
```

### Deployment Steps

```bash
# 1. Deploy video API
git add src/app/api/video/
git commit -m "feat(video): implement Bunny Stream token API"

# 2. Deploy VideoPlayer component
git add src/components/VideoPlayer.tsx
git commit -m "feat(video): implement HLS video player"

# 3. Update course parser to use VideoPlayer
git add src/lib/course-parser.ts
git commit -m "feat(video): integrate VideoPlayer in course content"

# 4. Push to main
git push origin main
```

### Post-Deployment Monitoring

**Metrics to Track:**
- Video load success rate
- Token generation latency
- CDN bandwidth usage
- Video playback errors

**Bunny Stream Dashboard:**
- Monitor bandwidth usage ($/GB)
- Track video encoding costs
- Check for 404 errors (missing videos)
- Monitor CDN performance (latency)

**Error Tracking:**
```typescript
// Track video errors
hls.on(Hls.Events.ERROR, (event, data) => {
  console.error('[Video] Playback error', {
    videoId,
    errorType: data.type,
    errorDetails: data.details,
    fatal: data.fatal
  });

  // Track in analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'video_error', {
      video_id: videoId,
      error_type: data.type,
      error_details: data.details
    });
  }
});
```

### Success Criteria

- [ ] Bunny Stream account configured
- [ ] Test video uploaded and encoded
- [ ] Token API returning valid URLs
- [ ] Video player loading and playing
- [ ] Progress tracking working
- [ ] < 1% video load errors
- [ ] CDN latency < 200ms

### Rollback Plan

If video playback fails:
```typescript
// Fallback to placeholder
{videoId ? (
  <VideoPlayer videoId={videoId} />
) : (
  <div className="bg-gray-800 p-8 rounded text-center">
    <p>Video coming soon</p>
  </div>
)}
```

---

## Feature 3: DiamondMindAI Chat Interface

### Deployment Readiness: ⚠️ Requires AI Backend

**Confidence:** 82%
**Risk:** Medium (cost overruns, rate limiting)
**Dependencies:** AI backend API (OpenAI, Anthropic, or custom)

### Pre-Deployment Requirements

**1. Choose AI Provider**

**Option A: OpenAI (GPT-4)**
```bash
# Pros: Reliable, well-documented, good quality
# Cons: Higher cost ($0.03/1K tokens)
# Setup: https://platform.openai.com

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
```

**Option B: Anthropic (Claude)**
```bash
# Pros: Better long-form responses, lower cost
# Cons: Newer API, less ecosystem support
# Setup: https://console.anthropic.com

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**Option C: Custom Backend**
```bash
# Pros: Full control, can add RAG/knowledge base
# Cons: More complex, requires deployment
# Setup: Deploy custom API service

AI_BACKEND_URL=https://your-ai-backend.com/chat
AI_BACKEND_KEY=your-secret-key
```

**2. Implement Rate Limiting**

```typescript
// src/app/api/chat/route.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter (requires Upstash Redis)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 messages per hour
  analytics: true,
});

export async function POST(req: Request) {
  // Get user identifier (IP or session ID)
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous';

  // Check rate limit
  const { success, limit, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  }

  // Continue with AI request...
}
```

**3. Implement Cost Tracking**

```typescript
// Track token usage and costs
const logChatCost = async (usage: {
  promptTokens: number;
  completionTokens: number;
  model: string;
}) => {
  const costs = {
    'gpt-4-turbo-preview': {
      input: 0.01 / 1000,   // $0.01 per 1K input tokens
      output: 0.03 / 1000,  // $0.03 per 1K output tokens
    },
    'claude-3-5-sonnet-20241022': {
      input: 0.003 / 1000,  // $0.003 per 1K input tokens
      output: 0.015 / 1000, // $0.015 per 1K output tokens
    },
  };

  const cost =
    usage.promptTokens * costs[usage.model].input +
    usage.completionTokens * costs[usage.model].output;

  // Log to database or monitoring
  console.log('[Chat] Cost tracking', { usage, cost });

  // Store in database for billing
  await turso.execute({
    sql: 'INSERT INTO chat_usage (timestamp, model, prompt_tokens, completion_tokens, cost) VALUES (?, ?, ?, ?, ?)',
    args: [new Date().toISOString(), usage.model, usage.promptTokens, usage.completionTokens, cost],
  });
};
```

**4. Implement Chat API**

```typescript
// src/app/api/chat/route.ts

import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json();

  // Rate limiting (see above)

  // System prompt for DiamondMindAI
  const systemPrompt = `You are DiamondMindAI, a coach specializing in:
  - Presence under pressure
  - Nervous system regulation
  - Identity transformation
  - Leadership in chaos

  Be concise, direct, and actionable. Use the "Diamond" philosophy:
  - Pressure reveals strength
  - Chaos creates clarity
  - Consciousness enables choice

  Keep responses under 200 words.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0].message;
    const usage = completion.usage;

    // Track cost
    await logChatCost({
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      model: 'gpt-4-turbo-preview',
    });

    return Response.json({
      message: response.content,
      conversationId,
    });
  } catch (error) {
    console.error('[Chat] API error', error);
    return Response.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
```

**5. Install Dependencies**

```bash
# For OpenAI
npm install openai

# For Anthropic
npm install @anthropic-ai/sdk

# For rate limiting
npm install @upstash/ratelimit @upstash/redis
```

### Testing Steps

**1. Test AI API Locally**
```bash
# Test chat endpoint
curl -X POST http://localhost:3003/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is presence under pressure?"}],
    "conversationId": "test-123"
  }'

# Expected: AI response with cost tracking logged
```

**2. Test Rate Limiting**
```bash
# Send 11 requests rapidly (limit is 10/hour)
for i in {1..11}; do
  curl -X POST http://localhost:3003/api/chat \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role": "user", "content": "Test"}]}'
done

# Expected: First 10 succeed, 11th returns 429 Too Many Requests
```

**3. Run E2E Tests**
```bash
npx playwright test chat-interaction.spec.ts

# Expected: All 53 tests passing (no more mocks)
```

### Deployment Steps

```bash
# 1. Deploy chat API
git add src/app/api/chat/
git commit -m "feat(chat): implement OpenAI chat API with rate limiting"

# 2. Update chat UI to use real API
git add src/app/app/chat/
git commit -m "feat(chat): integrate real AI responses"

# 3. Add cost tracking database schema
git add migrations/003_chat_usage.sql
git commit -m "feat(chat): add cost tracking table"

# 4. Push to main
git push origin main
```

### Post-Deployment Monitoring

**Critical Metrics:**
- API costs per day
- Rate limit hits
- Response latency
- Error rate

**Set Up Alerts:**
```typescript
// Alert if daily cost exceeds $10
const dailyCost = await calculateDailyCost();
if (dailyCost > 10) {
  await sendAlert({
    channel: 'slack',
    message: `⚠️ AI chat costs exceeded $10 today: $${dailyCost.toFixed(2)}`,
  });
}

// Alert if error rate > 5%
const errorRate = errors / totalRequests;
if (errorRate > 0.05) {
  await sendAlert({
    channel: 'slack',
    message: `⚠️ AI chat error rate: ${(errorRate * 100).toFixed(1)}%`,
  });
}
```

### Success Criteria

- [ ] AI provider configured
- [ ] Rate limiting working (10 msgs/hour)
- [ ] Cost tracking implemented
- [ ] Daily cost < $10
- [ ] Response latency < 5 seconds
- [ ] Error rate < 5%
- [ ] User satisfaction (manual review of conversations)

### Rollback Plan

If costs spike or quality is poor:
```typescript
// Disable AI chat temporarily
const CHAT_ENABLED = process.env.CHAT_ENABLED === 'true';

if (!CHAT_ENABLED) {
  return Response.json({
    message: "DiamondMindAI is temporarily unavailable for maintenance. Please check back soon.",
  });
}
```

---

## Feature 4: Authentication System

### Deployment Readiness: ⚠️ Requires Email + OAuth Setup

**Confidence:** 78%
**Risk:** Medium-High (user lockout, security)
**Dependencies:** Email service (Resend), OAuth providers

### Pre-Deployment Requirements

**1. Configure Email Magic Links**

Already using Resend for newsletter, extend for authentication:

```typescript
// src/lib/resend.ts - Add magic link email

export async function sendMagicLinkEmail(params: {
  to: string;
  magicLink: string;
}) {
  const { to, magicLink } = params;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Sign in to Becoming Diamond</h1>
        <p>Click the link below to sign in:</p>
        <a href="${magicLink}" style="
          display: inline-block;
          background: #4fc3f7;
          color: #000;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
        ">
          Sign In
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </body>
    </html>
  `;

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Sign in to Becoming Diamond',
    html: emailHtml,
  });

  return {
    success: !!result.data?.id,
    emailId: result.data?.id,
  };
}
```

**2. Implement NextAuth.js**

```bash
# Install NextAuth
npm install next-auth@beta

# Create auth configuration
# src/auth.ts (already exists at project root)
```

**3. Configure OAuth Providers**

**GitHub OAuth:**
```bash
# 1. Go to https://github.com/settings/developers
# 2. New OAuth App
# 3. Application name: Becoming Diamond
# 4. Homepage URL: https://becomingdiamond.com
# 5. Callback URL: https://becomingdiamond.com/api/auth/callback/github
# 6. Copy Client ID and Client Secret

GITHUB_CLIENT_ID=Iv1...
GITHUB_CLIENT_SECRET=abc123...
```

**Google OAuth:**
```bash
# 1. Go to https://console.cloud.google.com
# 2. Create new project
# 3. Enable Google+ API
# 4. Create OAuth 2.0 credentials
# 5. Authorized redirect URI: https://becomingdiamond.com/api/auth/callback/google

GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

**4. Update Auth Configuration**

```typescript
// src/auth.ts

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      session.user.id = token.sub;
      return session;
    },
  },
});
```

**5. Create Sign-In Pages**

```typescript
// src/app/auth/signin/page.tsx

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signIn('resend', {
      email,
      redirect: false,
    });

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full p-8 bg-gray-900 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>

        {sent ? (
          <p className="text-green-400">
            Check your email! We sent you a magic link to sign in.
          </p>
        ) : (
          <>
            <form onSubmit={handleEmailSignIn} className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded mb-4"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-black px-4 py-2 rounded"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm mb-4">Or sign in with:</p>

              <button
                onClick={() => signIn('github')}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-2"
              >
                Sign in with GitHub
              </button>

              <button
                onClick={() => signIn('google')}
                className="w-full bg-white text-black px-4 py-2 rounded"
              >
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

### Testing Steps

**1. Test Email Magic Link**
```bash
# Submit email via sign-in form
# Check inbox for magic link email
# Click link → should redirect to /app
# Session should persist after page reload
```

**2. Test GitHub OAuth**
```bash
# Click "Sign in with GitHub"
# Redirects to GitHub authorization
# Approve → redirects back to /app
# Session persists
```

**3. Test Protected Routes**
```bash
# Navigate to /app/courses (unauthenticated)
# Should redirect to /auth/signin
# Sign in → redirect back to /app/courses
```

**4. Run E2E Tests**
```bash
npx playwright test auth-flow.spec.ts

# Expected: All 13 tests passing (no more pending)
```

### Deployment Steps

```bash
# 1. Deploy auth configuration
git add src/auth.ts
git commit -m "feat(auth): configure NextAuth with email + OAuth"

# 2. Deploy sign-in pages
git add src/app/auth/
git commit -m "feat(auth): create sign-in and error pages"

# 3. Add protected route middleware
git add middleware.ts
git commit -m "feat(auth): add authentication middleware"

# 4. Push to main
git push origin main
```

### Post-Deployment Monitoring

**Critical Metrics:**
- Sign-in success rate
- Email delivery rate (magic links)
- OAuth redirect errors
- Session persistence issues

**Set Up Alerts:**
```typescript
// Alert if sign-in failure rate > 10%
const failureRate = failures / totalAttempts;
if (failureRate > 0.1) {
  await sendAlert({
    channel: 'slack',
    message: `⚠️ Auth failure rate: ${(failureRate * 100).toFixed(1)}%`,
  });
}
```

### Success Criteria

- [ ] Email service configured
- [ ] OAuth providers registered
- [ ] Magic link emails delivering
- [ ] OAuth sign-in working
- [ ] Protected routes enforcing auth
- [ ] Session persistence validated
- [ ] < 5% sign-in error rate
- [ ] < 1% email delivery failures

### Rollback Plan

If authentication breaks:
```typescript
// Temporarily disable auth requirement
// In middleware.ts:
export function middleware(request: NextRequest) {
  // Skip auth check temporarily
  if (process.env.DISABLE_AUTH === 'true') {
    return NextResponse.next();
  }

  // Normal auth flow...
}
```

---

## Monitoring Dashboard Setup

### Uptime Monitoring

**Use Uptime Robot (Free):**
```bash
# 1. Go to https://uptimerobot.com
# 2. Add monitors:
#    - Homepage: https://becomingdiamond.com (HTTP)
#    - API: https://becomingdiamond.com/api/health (HTTP)
#    - Chat: https://becomingdiamond.com/api/chat (Keyword: "error")
# 3. Configure alerts:
#    - Email notifications
#    - Slack webhooks
#    - Check interval: 5 minutes
```

### Cost Monitoring

**Track AI Costs:**
```sql
-- Create daily cost report
CREATE VIEW daily_chat_costs AS
SELECT
  DATE(timestamp) as date,
  SUM(cost) as total_cost,
  SUM(prompt_tokens + completion_tokens) as total_tokens,
  COUNT(*) as total_requests
FROM chat_usage
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Query daily costs
SELECT * FROM daily_chat_costs WHERE date >= DATE('now', '-7 days');
```

**Alert on Cost Spike:**
```typescript
// Run hourly via cron
const hourlyCost = await calculateHourlyChatCost();
if (hourlyCost > 2) { // $2/hour = $48/day
  await sendAlert({
    channel: 'slack',
    message: `⚠️ Chat costs spiking: $${hourlyCost.toFixed(2)}/hour`,
    severity: 'high',
  });
}
```

### Error Tracking

**Use Sentry (Recommended):**
```bash
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs

# Configure error tracking
# sentry.client.config.ts, sentry.server.config.ts
```

---

## Final Checklist

**Before Deploying Tier 2:**
- [ ] Settings documentation published
- [ ] Bunny Stream account created (for video)
- [ ] AI backend configured (for chat)
- [ ] OAuth providers registered (for auth)
- [ ] Rate limiting implemented (chat + auth)
- [ ] Cost tracking enabled (chat)
- [ ] Monitoring dashboards configured
- [ ] Rollback plan documented
- [ ] Team trained on new features

**After Deployment:**
- [ ] Monitor costs daily (first week)
- [ ] Review error logs (first 48 hours)
- [ ] Gather user feedback
- [ ] Document issues for next iteration

---

**Deployment Owner:** [Your Name]
**Estimated Completion:** Week 2-3 post-Tier 1
**Status:** ⚠️ Requires External Service Configuration
