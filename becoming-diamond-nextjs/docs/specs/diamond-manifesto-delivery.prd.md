# Diamond Manifesto Delivery Feature - PRD

**Status:** Planning
**Priority:** High
**Estimated Effort:** 4-6 hours
**Dependencies:** Resend email infrastructure, existing lead capture flow

---

## Overview

Deliver a copy of the "Diamond Manifesto" PDF/image to new leads immediately after email capture on the homepage. This enhances the lead magnet value proposition and provides immediate gratification for subscribers.

---

## Current State Analysis

### Existing Infrastructure

**Lead Capture Flow:**
1. User submits email via `LeadMagnetSection` component
2. Frontend calls `/api/leads` (POST)
3. API validates email, checks rate limits and duplicates
4. Lead stored in Turso database
5. `sendWelcomeEmail()` triggered via Resend
6. User redirected to `/book` page after 2 seconds

**Email Infrastructure:**
- **Provider:** Resend (configured, operational)
- **Template:** `src/emails/welcome-email.tsx` (React Email)
- **Current Content:** Sprint access link, benefits list, book CTA, testimonial
- **Delivery Method:** HTML email with button CTAs

**Manifesto Asset:**
- **Location:** `public/Diamond Manifesto.png`
- **Size:** 2.1 MB (PNG format)
- **Content:** Full-text manifesto with diamond visual
- **Format:** Image (needs PDF conversion for better delivery)

---

## Problem Statement

**Current Gap:**
The welcome email promotes the Diamond Sprint and book but doesn't include the promised "Diamond Manifesto" that could serve as:
1. Immediate value delivery (builds trust)
2. Brand reinforcement (manifesto positioning)
3. Shareable content (viral potential)
4. Conversion bridge (primes mindset before sprint/book)

**User Expectation:**
When users sign up for "Diamond Sprint materials," they expect immediate access to foundational content that sets the philosophical framework.

---

## Proposed Solution

### Architecture: Email Attachment Approach

**Delivery Method:** Attach Diamond Manifesto PDF directly to welcome email

**Why This Approach:**
- ✅ Immediate delivery (no extra clicks)
- ✅ Works offline (users can save/print)
- ✅ Shareable (forward to friends)
- ✅ Simple implementation (no auth/hosting required)
- ✅ High perceived value (PDF attachment feels substantial)
- ✅ Resend supports attachments natively

**Alternative Approaches Considered:**

1. **Download Link to Public URL**
   - ❌ Requires extra click (friction)
   - ❌ Public URL means no tracking of downloads
   - ✅ Smaller email size

2. **Authenticated Download Endpoint**
   - ❌ Complex (requires token generation, auth)
   - ❌ Friction (users must click, may not download)
   - ✅ Can track individual downloads

3. **Landing Page with Form Gate**
   - ❌ Double opt-in friction
   - ❌ Users already gave email
   - ✅ Can add additional CTAs

**Decision:** Email attachment provides best UX and simplest implementation.

---

## Technical Implementation Plan

### Phase 1: Asset Preparation (30 minutes)

**Task 1.1: Convert PNG to PDF**
```bash
# Use ImageMagick or similar tool
convert "public/Diamond Manifesto.png" "public/assets/diamond-manifesto.pdf"
```

**Task 1.2: Optimize PDF Size**
- Target: < 500 KB (email attachment best practice)
- Tools: Adobe Acrobat, Ghostscript, or online PDF compressor
- Ensure text remains readable on mobile

**Task 1.3: Verify Asset Quality**
- Test PDF opens on iOS Mail, Gmail, Outlook
- Verify text is crisp at 100% zoom
- Confirm file size under 1 MB (Resend limit: 40 MB, but keep small)

**Acceptance Criteria:**
- [ ] PDF file created at `public/assets/diamond-manifesto.pdf`
- [ ] File size < 500 KB
- [ ] Text readable on mobile devices
- [ ] Opens correctly in major email clients

---

### Phase 2: Email Template Enhancement (1-2 hours)

**File:** `src/emails/welcome-email.tsx`

**Task 2.1: Add Manifesto Section**

Insert new section before testimonial:

```tsx
{/* Diamond Manifesto */}
<Section style={manifestoBox}>
  <Heading style={h2}>📖 Your Diamond Manifesto</Heading>
  <Text style={text}>
    We've included the complete Diamond Manifesto as a gift. This is the philosophical
    foundation of everything we teach—your blueprint for unshakable presence.
  </Text>
  <Text style={manifestoHighlight}>
    "I am Diamond. I am conscious. I am presence."
  </Text>
  <Text style={smallText}>
    (The Manifesto is attached to this email as a PDF—check your attachments)
  </Text>
</Section>
```

**Task 2.2: Update Email Copy**

Modify preview text:
```tsx
<Preview>Your Diamond Sprint materials + Manifesto are ready!</Preview>
```

Modify heading:
```tsx
<Heading style={h1}>Welcome to the Diamond Sprint 💎</Heading>
<Text style={subheading}>+ Your Complete Diamond Manifesto Inside</Text>
```

**Task 2.3: Add Manifesto Styles**

```tsx
const manifestoBox = {
  backgroundColor: 'rgba(79, 195, 247, 0.15)',
  border: '2px solid #4fc3f7',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#4fc3f7',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '16px',
  textAlign: 'center' as const,
};

const manifestoHighlight = {
  color: '#4fc3f7',
  fontSize: '18px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '20px 0',
  fontWeight: 'bold' as const,
};

const subheading = {
  color: '#9ca3af',
  fontSize: '18px',
  textAlign: 'center' as const,
  marginTop: '-16px',
  marginBottom: '24px',
};

const smallText = {
  color: '#9ca3af',
  fontSize: '14px',
  marginTop: '12px',
};
```

**Acceptance Criteria:**
- [ ] Manifesto section visually prominent in email
- [ ] Copy emphasizes manifesto as a "gift"
- [ ] Clear instruction to check attachments
- [ ] Design consistent with existing email theme

---

### Phase 3: Resend Integration (1-2 hours)

**File:** `src/lib/resend.ts`

**Task 3.1: Import File System Module**

```typescript
import fs from 'fs';
import path from 'path';
```

**Task 3.2: Add Attachment Helper Function**

```typescript
/**
 * Load Diamond Manifesto PDF as base64 for email attachment
 */
function getManifestoAttachment(): { filename: string; content: Buffer } | null {
  try {
    const manifestoPath = path.join(process.cwd(), 'public', 'assets', 'diamond-manifesto.pdf');

    if (!fs.existsSync(manifestoPath)) {
      log.error('Diamond Manifesto PDF not found', 'EMAIL', { path: manifestoPath });
      return null;
    }

    const content = fs.readFileSync(manifestoPath);

    return {
      filename: 'Diamond-Manifesto.pdf',
      content,
    };
  } catch (error) {
    log.error('Failed to load Diamond Manifesto for attachment', 'EMAIL', error);
    return null;
  }
}
```

**Task 3.3: Update `sendWelcomeEmail()` Function**

Modify the Resend email.send call:

```typescript
// Load manifesto attachment
const manifestoAttachment = getManifestoAttachment();

// Send email via Resend
const resend = getResendClient();
const emailPayload: any = {
  from: FROM_EMAIL,
  to,
  subject: "Your Diamond Sprint Materials + Manifesto Are Here 💎",
  html: emailHtml,
};

// Add attachment if available
if (manifestoAttachment) {
  emailPayload.attachments = [manifestoAttachment];
  await log.info('Including Diamond Manifesto attachment', 'EMAIL', {
    filename: manifestoAttachment.filename,
    size: manifestoAttachment.content.length,
  });
} else {
  await log.warn('Sending email without Diamond Manifesto attachment', 'EMAIL');
}

const result = await resend.emails.send(emailPayload);
```

**Task 3.4: Update Email Subject Line**

```typescript
subject: "Your Diamond Sprint Materials + Manifesto Are Here 💎"
```

**Acceptance Criteria:**
- [ ] PDF attachment loads from filesystem
- [ ] Attachment added to email payload
- [ ] Graceful fallback if PDF missing (email still sends)
- [ ] Logging tracks attachment inclusion/failure
- [ ] Subject line updated to mention manifesto

---

### Phase 4: Lead Magnet Copy Updates (30 minutes)

**File:** `src/app/page.tsx`

**Task 4.1: Update Lead Magnet Section Props**

Locate `LeadMagnetSection` component usage and update:

```tsx
<LeadMagnetSection
  badge="Free Diamond Sprint + Manifesto"
  title={
    <>
      Get the <span className="text-primary">30-Day Diamond Sprint</span>
      <br />+ Complete Diamond Manifesto
    </>
  }
  subtitle="Start your transformation today with our complete starter pack"
  benefits={[
    { text: "30-Day Diamond Sprint program (complete training materials)" },
    { text: "The Diamond Manifesto PDF (philosophical foundation)" },
    { text: "Daily presence practices and nervous system regulation" },
    { text: "Exclusive insights on AI-proof skills and leadership" },
  ]}
  bonusItem="BONUS: Early access to new courses and community events"
  ctaText="Send Me the Sprint + Manifesto"
  disclaimer="No spam. Unsubscribe anytime."
/>
```

**Acceptance Criteria:**
- [ ] Badge mentions "Manifesto"
- [ ] Title includes "Complete Diamond Manifesto"
- [ ] Benefits list explicitly includes manifesto PDF
- [ ] CTA button text updated

---

### Phase 5: Testing & Validation (1 hour)

**Task 5.1: Local Email Testing**

```bash
# Send test email via Resend CLI or API test
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "support@becomingdiamond.com",
    "to": "your-test-email@example.com",
    "subject": "Test: Diamond Manifesto Delivery",
    "html": "<p>Test email with attachment</p>",
    "attachments": [...]
  }'
```

**Task 5.2: Cross-Client Testing**

Test email rendering and attachment download on:
- [ ] Gmail (web)
- [ ] Gmail (iOS app)
- [ ] Apple Mail (macOS)
- [ ] Apple Mail (iOS)
- [ ] Outlook (web)
- [ ] Outlook (desktop)

**Task 5.3: E2E Flow Testing**

1. Clear test email from database
2. Submit email via homepage lead magnet form
3. Verify email received within 60 seconds
4. Verify PDF attachment present
5. Download and open PDF
6. Verify redirect to `/book` page works
7. Verify database records email_sent_at timestamp

**Task 5.4: Error Scenario Testing**

- [ ] Test with missing PDF file (should send email without attachment)
- [ ] Test with corrupted PDF file (should log error, skip attachment)
- [ ] Test with rate limit triggered (should return 429)
- [ ] Test with duplicate email (should return 409)

**Acceptance Criteria:**
- [ ] All major email clients render email correctly
- [ ] PDF attachment downloads and opens properly
- [ ] Email subject line correct
- [ ] Manifesto section visible in email body
- [ ] Fallback behavior works if PDF missing
- [ ] No errors in server logs during normal flow

---

### Phase 6: Deployment & Monitoring (30 minutes)

**Task 6.1: Pre-Deployment Checklist**

- [ ] PDF asset committed to repository at `public/assets/diamond-manifesto.pdf`
- [ ] PDF file size < 500 KB
- [ ] Code changes tested locally
- [ ] All E2E tests pass
- [ ] Environment variables confirmed on production (RESEND_API_KEY)

**Task 6.2: Deploy to Production**

```bash
# Push to main branch (triggers Vercel deployment)
git add .
git commit -m "feat: add Diamond Manifesto PDF delivery to welcome email"
git push origin main
```

**Task 6.3: Post-Deployment Verification**

1. Submit test email via production homepage
2. Verify welcome email received with attachment
3. Check Resend dashboard for delivery status
4. Monitor Vercel logs for any errors
5. Test unsubscribe link functionality

**Task 6.4: Setup Monitoring**

Add Resend webhook for email events (optional):
- Track open rates
- Track attachment download rates
- Monitor bounce/complaint rates

**Acceptance Criteria:**
- [ ] Feature live on production
- [ ] Test email received successfully with attachment
- [ ] No errors in production logs
- [ ] Resend dashboard shows successful delivery

---

## Success Metrics

**Primary KPIs:**
- Email delivery rate: > 98%
- Email open rate: > 40% (industry standard: 20-30%)
- Attachment download rate: > 60% (track via unique file analytics if implemented)
- Bounce rate: < 2%

**Secondary KPIs:**
- Lead-to-book conversion rate (from `/book` redirect)
- Time to first email open (measure immediacy perception)
- Unsubscribe rate: < 0.5%

**Qualitative Metrics:**
- User feedback on manifesto content
- Social shares of manifesto (if trackable)

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| PDF file missing | Low | Medium | Graceful fallback (send email without attachment, log error) |
| Email marked as spam (due to attachment) | Medium | High | Use domain authentication (SPF, DKIM), keep file size < 500 KB |
| Resend attachment limit exceeded | Low | High | Enforce file size limit in code, test thoroughly |
| Email client strips attachment | Medium | Medium | Add inline note about checking spam/promotions folder |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Manifesto content shared publicly | High | Low | Content is marketing material (sharing is positive) |
| Users expect interactive PDF | Low | Low | Set expectations in email copy (it's a visual manifesto) |
| Perceived as spam due to attachment | Low | Medium | Clear value proposition, professional branding |

---

## Future Enhancements

**Phase 2 (Post-Launch):**
1. **Manifesto Download Analytics**
   - Track who downloads vs. who doesn't
   - A/B test attachment vs. download link

2. **Interactive Manifesto Landing Page**
   - Create web version at `/manifesto`
   - Add social sharing buttons
   - Track engagement metrics

3. **Manifesto Variation Testing**
   - Create multiple visual versions
   - Test different quotes/layouts
   - Personalize based on lead source

4. **Print-on-Demand Integration**
   - Offer physical poster version
   - Upsell opportunity
   - Shopify/Printful integration

---

## Open Questions

- [ ] Should manifesto also be available on website as a public download?
- [ ] Do we need to track individual attachment opens? (Requires pixel tracking)
- [ ] Should we gate the manifesto differently for sprint access vs. general leads?
- [ ] Do we want to add a "Share your manifesto" social CTA?

---

## Appendix

### Resend Attachment API Reference

```typescript
// Resend attachment format
interface Attachment {
  filename: string;        // "Diamond-Manifesto.pdf"
  content: Buffer;         // File buffer
  // OR
  path?: string;          // File system path (alternative to content)
}

// Usage
resend.emails.send({
  from: 'support@becomingdiamond.com',
  to: 'user@example.com',
  subject: 'Your materials are here',
  html: '<p>Email content</p>',
  attachments: [
    {
      filename: 'Diamond-Manifesto.pdf',
      content: fs.readFileSync('path/to/file.pdf'),
    }
  ]
})
```

### Email Best Practices

**Attachment Size Limits:**
- Gmail: 25 MB (received), 25 MB (sent)
- Outlook: 20 MB (received/sent)
- Yahoo: 25 MB
- Apple Mail: 20 MB
- **Recommendation:** Keep under 1 MB for deliverability

**Email Client Compatibility:**
- All major clients support PDF attachments
- Mobile clients may require "download" action
- Some clients show inline preview, others require separate app

**Spam Filter Considerations:**
- Use authenticated sending domain (SPF, DKIM, DMARC)
- Avoid spammy subject lines ("FREE!!!", excessive emojis)
- Maintain good sender reputation
- Include unsubscribe link (required by law)

---

## Timeline

| Phase | Duration | Blocker Dependencies |
|-------|----------|---------------------|
| Phase 1: Asset Preparation | 30 min | None |
| Phase 2: Email Template | 1-2 hours | Phase 1 complete |
| Phase 3: Resend Integration | 1-2 hours | Phase 2 complete |
| Phase 4: Lead Magnet Copy | 30 min | None (can be parallel) |
| Phase 5: Testing | 1 hour | Phases 1-4 complete |
| Phase 6: Deployment | 30 min | Phase 5 complete |
| **Total** | **4-6 hours** | Sequential execution |

---

## Approval & Sign-off

**Stakeholders:**
- [ ] Product Owner (feature approval)
- [ ] Design (manifesto PDF quality)
- [ ] Engineering (technical implementation)
- [ ] Marketing (email copy)
- [ ] Legal (compliance review for email content)

**Next Steps:**
1. Review and approve PRD
2. Confirm PDF asset is finalized and optimized
3. Allocate development time
4. Begin Phase 1 implementation

---

**Document Version:** 1.0
**Last Updated:** 2025-11-04
**Author:** Claude (AI Assistant)
**Status:** Ready for Review
