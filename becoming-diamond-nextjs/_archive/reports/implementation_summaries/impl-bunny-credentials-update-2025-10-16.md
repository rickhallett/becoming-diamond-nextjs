# Bunny Stream Credentials Update

**Date**: 2025-10-16
**Updated By**: Development Team
**Type**: Infrastructure Update

## Summary

Updated Bunny Stream video hosting credentials to new library and CDN configuration.

## Changes Made

### Environment Variables Updated

| Variable | Old Value | New Value | Status |
|----------|-----------|-----------|--------|
| `BUNNY_STREAM_LIBRARY_ID` | `504876` | `512164` | ✅ Updated |
| `BUNNY_STREAM_API_KEY` | `869a201d-...` | `26deeb0e-...` | ✅ Updated |
| `BUNNY_STREAM_CDN_HOSTNAME` | `vz-d03ef62e-af2.b-cdn.net` | `vz-b0def8eb-946.b-cdn.net` | ✅ Updated |
| `BUNNY_STREAM_PULL_ZONE` | *(not set)* | `vz-b0def8eb-946` | ✅ Added |

### Files Modified

1. **`.env.local`** - Primary environment configuration
   - Updated all Bunny Stream credentials
   - Added PULL_ZONE variable for future use

2. **`.env.example`** - Template for new environments
   - Added PULL_ZONE placeholder
   - Documentation comments remain accurate

## New Configuration Details

**Library Information**:
- Library ID: `512164`
- Pull Zone: `vz-b0def8eb-946`
- CDN Hostname: `vz-b0def8eb-946.b-cdn.net`

**API Endpoints Using These Credentials**:
- `/api/video/[videoId]/token` - Video playback token generation
- `/api/videos` - Video library listing

## Verification Steps

### 1. Check Environment Variables
```bash
grep "BUNNY_STREAM" .env.local
```

**Expected Output**:
```
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=26deeb0e-ad7b-4983-bd206a2ae3b7-0b0a-4334
BUNNY_STREAM_CDN_HOSTNAME=vz-b0def8eb-946.b-cdn.net
BUNNY_STREAM_PULL_ZONE=vz-b0def8eb-946
```

### 2. Test Token Generation API
```bash
# Start dev server
npm run dev

# Test token endpoint (requires authentication)
curl http://localhost:3000/api/video/test-video-id/token \
  -H "Cookie: your-session-cookie"
```

**Expected Response**:
```json
{
  "streamUrl": "https://vz-b0def8eb-946.b-cdn.net/test-video-id/playlist.m3u8?token=...&expires=...",
  "token": "generated-hash",
  "expiresAt": "2025-10-17T..."
}
```

### 3. Test Video Library API
```bash
curl http://localhost:3000/api/videos \
  -H "Cookie: your-session-cookie"
```

**Expected Response**:
```json
{
  "videos": [...],
  "cached": false,
  "totalCount": N
}
```

### 4. Test Video Playback
1. Navigate to a sprint day with embedded video
2. Example: `/app/sprint/1` (Day 1 has video ID: `16e263db-8c22-46e8-8e3c-cd9216d7a2ac`)
3. Verify video player loads and plays correctly

## Existing Video IDs

The following video IDs are already embedded in sprint content and should work with the new library:

| Day | Video ID | File |
|-----|----------|------|
| Day 1 | `16e263db-8c22-46e8-8e3c-cd9216d7a2ac` | `content/sprint/day-01.md:19` |
| Day 2 | `edadb6bb-4b15-44d9-b2b1-35ec2dafe101` | `content/sprint/day-02.md:23` |
| Day 3 | `4cad3e37-38b6-4b41-a86f-13e44ed917a4` | `content/sprint/day-03.md:17` |
| Day 4 | `735281cb-618f-407d-93db-c178eaef0655` | `content/sprint/day-04.md:38` |
| Day 5 | `5cdfbef8-3f9f-40cf-95f0-5a68e6608f90` | `content/sprint/day-05.md:53` |
| Day 6 | `edadb6bb-4b15-44d9-b2b1-35ec2dafe101` | `content/sprint/day-06.md:19` |
| Day 7 | `735281cb-618f-407d-93db-c178eaef0655` | `content/sprint/day-07.md:63` |

**Note**: These video IDs must exist in the new Bunny library (`512164`) or be migrated from the old library.

## Migration Checklist

### Pre-Migration
- [✅] New Bunny library created (`512164`)
- [✅] New CDN pull zone configured (`vz-b0def8eb-946`)
- [✅] New API key generated
- [✅] Environment variables updated

### Video Content Migration
- [ ] **CRITICAL**: Migrate existing videos from old library (`504876`) to new library (`512164`)
  - Option A: Re-upload videos to new library
  - Option B: Use Bunny's migration API (if available)
  - Option C: Update video IDs in markdown if videos exist in new library with different IDs

### Testing
- [ ] Test token generation with new credentials
- [ ] Test video playback for all 7 embedded videos
- [ ] Verify HLS streaming works (Chrome, Firefox, Safari)
- [ ] Test mobile playback (iOS, Android)
- [ ] Check video listing API (`/api/videos`)

### Deployment
- [ ] Update environment variables in production (Vercel)
- [ ] Deploy updated `.env.local` changes
- [ ] Test in production environment
- [ ] Monitor for errors in production logs

## Code Impact Analysis

### No Code Changes Required ✅

All code properly uses environment variables:

**Token API** (`src/app/api/video/[videoId]/token/route.ts`):
```typescript
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;
```

**Video Library API** (`src/app/api/videos/route.ts`):
```typescript
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
```

### No Hardcoded Credentials Found ✅

Verification confirmed no hardcoded credentials in:
- Source code (`src/`)
- Components
- API routes
- Configuration files

## Rollback Plan

If issues arise with the new credentials:

1. **Immediate Rollback**:
   ```bash
   # Restore old credentials in .env.local
   BUNNY_STREAM_LIBRARY_ID=504876
   BUNNY_STREAM_API_KEY=869a201d-3d97-4966-aee9f8306997-8cf2-497d
   BUNNY_STREAM_CDN_HOSTNAME=vz-d03ef62e-af2.b-cdn.net
   ```

2. **Restart Development Server**:
   ```bash
   npm run dev
   ```

3. **Verify Old Videos Still Work**:
   - Test existing video IDs
   - Confirm playback functionality

## Security Notes

- Old API key should be revoked in Bunny dashboard after successful migration
- New API key has been added to `.env.local` (not committed to Git)
- `.env.example` updated with placeholder only (no real credentials)
- Production credentials should be updated separately in Vercel dashboard

## Documentation Updates

- [✅] `.env.local` - Updated with new credentials
- [✅] `.env.example` - Added PULL_ZONE placeholder
- [✅] This migration report created
- [ ] Update CLAUDE.md if needed (currently uses placeholders, no changes needed)
- [ ] Update video documentation when migration is complete

## Next Steps

1. **CRITICAL**: Verify all 7 existing video IDs work with new library
   - If videos don't exist in new library, they must be migrated
   - Test each embedded video ID

2. **Production Update**:
   - Update Vercel environment variables
   - Deploy changes
   - Test in production

3. **Old Library Cleanup**:
   - After confirming new library works, deactivate old library
   - Revoke old API key for security

4. **Monitoring**:
   - Monitor video playback errors
   - Check Bunny Stream analytics for usage
   - Verify CDN performance

## Contact Information

**Bunny Stream Dashboard**: https://dash.bunny.net/stream
**Library ID**: 512164
**Support**: https://support.bunny.net

---

**Status**: ✅ Environment variables updated, pending video content verification
**Updated**: 2025-10-16
**Next Review**: After video migration testing
