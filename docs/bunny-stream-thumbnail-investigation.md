# Bunny Stream Thumbnail Access Investigation

## Summary

Thumbnail URLs are returning **403 Forbidden** errors due to Bunny Stream security settings. The thumbnails exist in metadata but are blocked by token authentication and/or referer protection.

## Test Results

### HTTP Status Codes
- **CDN URLs** (`vz-b0def8eb-946.b-cdn.net`): **403 Forbidden**
- **API Endpoint**: 404 Not Found
- **iframe.mediadelivery.net**: 404 Not Found
- **video.bunnycdn.com/play**: 404 Not Found

### Metadata Confirmation
All 61 videos have `thumbnailFileName` populated (e.g., `thumbnail_bca8927d.jpg`), confirming thumbnails exist.

## Root Cause: Security Settings

According to [Bunny Stream 403 Troubleshooting](https://support.bunny.net/hc/en-us/articles/8533327127708-Troubleshooting-Bunny-Stream-403-Errors), 403 errors occur due to:

### 1. Direct Link Token Authentication
When enabled, thumbnails, previews, and MP4s require **signed tokens** to access. This setting is found at:
**Stream → Your Video Library → Security → General**

### 2. Block Direct URL File Access
Prevents direct file access without proper authentication.

### 3. Allowed Domains (Referer Protection)
If configured, only listed domains can embed/access content. Direct access without a valid referrer returns 403.

## Token Authentication Issue

### Current Implementation (Video Tokens)
Located in `src/app/api/video/[videoId]/token/route.ts`:
```typescript
const tokenBase = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${videoId}`;
const token = crypto.createHash('sha256').update(tokenBase).digest('hex');
```

This works for **HLS playlist URLs** but may not work for direct file access (thumbnails).

### Correct CDN Token Authentication
According to [Bunny CDN Token Authentication](https://docs.bunny.net/docs/cdn-token-authentication):

```typescript
// Hashable base format: {security_key}{url_path}{expiration_time}
const hashableBase = `${securityKey}/path/to/file${expirationTime}`;
const token = Buffer.from(
  crypto.createHash('sha256')
    .update(hashableBase)
    .digest()  // Note: raw digest, NOT 'hex'
).toString('base64')
  .replace(/\n/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');
```

**Key Differences**:
1. Uses raw SHA256 digest, then Base64 encodes (not hex)
2. Includes URL path in the hashable base
3. Requires Base64 URL-safe character replacements
4. May need a separate "Token Authentication Key" from dashboard

## Solutions

### Option 1: Disable Token Authentication for Thumbnails (Recommended for MVP)

**Dashboard Configuration**:
1. Go to **Stream → Your Video Library → Security → General**
2. Check if **"Direct Link Token Authentication"** is enabled
3. If enabled, either:
   - Disable it (makes thumbnails publicly accessible)
   - Or configure **Allowed Domains** to include your production domain

**Pros**:
- Simple, immediate solution
- No code changes required
- Thumbnails accessible via standard URLs

**Cons**:
- Thumbnails publicly accessible (but videos still token-protected)
- May not meet security requirements

### Option 2: Implement Proper CDN Token Authentication

**Implementation**:
1. Get/create **Token Authentication Key** from Bunny Stream dashboard
2. Implement correct signing algorithm (see above)
3. Create API route `/api/video/[videoId]/thumbnail` that:
   - Validates user session
   - Generates signed thumbnail URL
   - Returns URL to client

**Pros**:
- Full security control
- Thumbnails protected like videos
- Follows Bunny CDN best practices

**Cons**:
- Requires code implementation
- Additional API calls
- More complex

### Option 3: Proxy Thumbnails Through Next.js API

**Implementation**:
```typescript
// /api/video/[videoId]/thumbnail/route.ts
export async function GET(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch thumbnail from Bunny using API key
  const response = await fetch(
    `https://${CDN_HOSTNAME}/${params.videoId}/${thumbnailFileName}`,
    {
      headers: {
        'AccessKey': BUNNY_API_KEY,  // Server-side only
      },
    }
  );

  const imageBuffer = await response.arrayBuffer();

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
```

**Pros**:
- No client-side token generation needed
- API key never exposed
- Works with existing security settings

**Cons**:
- All thumbnail requests go through your API
- Bandwidth costs (thumbnails served by your server)
- Not leveraging CDN caching fully

## Recommended Approach

**For MVP**: Option 1 (disable token auth for thumbnails)
- Check Bunny Stream dashboard security settings
- Disable "Direct Link Token Authentication" OR add production domain to "Allowed Domains"
- Test thumbnail URLs again

**For Production**: Option 2 (implement CDN token auth)
- Use proper token signing algorithm
- Maintain security for all content
- Cache signed URLs to reduce API calls

## Next Steps

1. **Check Bunny Stream dashboard** security settings
2. **Test Option 1** by adjusting security settings
3. If Option 1 doesn't meet security requirements, implement Option 2 or 3
4. Update VideoPlayer component to use thumbnail URLs once accessible

## Testing

Run test script to verify access:
```bash
npm run test:thumbnails
```

Expected result after fix: One or more URL patterns should return status 200 instead of 403.

## Resources

- [Bunny Stream 403 Troubleshooting](https://support.bunny.net/hc/en-us/articles/8533327127708-Troubleshooting-Bunny-Stream-403-Errors)
- [Bunny CDN Token Authentication](https://docs.bunny.net/docs/cdn-token-authentication)
- [How to Sign URLs for BunnyCDN](https://support.bunny.net/hc/en-us/articles/360016055099-How-to-sign-URLs-for-BunnyCDN-Token-Authentication)
- [Video Storage Structure](https://docs.bunny.net/docs/stream-video-storage-structure)

## Test Script Location

`scripts/test-bunny-thumbnails.ts` - Comprehensive test of API and CDN access patterns with HTTP status codes
