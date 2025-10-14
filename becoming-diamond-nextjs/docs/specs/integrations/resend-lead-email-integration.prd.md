# Resend Email Integration for Lead Generation

**Version:** 1.0
**Date:** 2025-10-06
**Status:** Planning
**Priority:** High
**Category:** Integration / Email Marketing

---

## Executive Summary

The lead capture system currently stores emails in the Turso database but does not send any emails to subscribers despite the UI messaging that states "Check your email for the Diamond Sprint materials." This PRD outlines the integration of Resend email service to deliver automated welcome emails and the promised Diamond Sprint materials to new leads.

**Key Deliverables:**
- Resend API integration with error handling and retry logic
- Welcome email template with Diamond Sprint materials
- Email delivery within `/api/leads` route handler
- Email tracking and analytics foundation
- Unsubscribe mechanism and preference management
- Admin email notifications for new leads

---

## Problem Statement

### Current Issues

1. **Broken Promise**: The success message tells users to "Check your email" but no email is sent
2. **Manual Fulfillment**: No automated delivery of Diamond Sprint materials
3. **Zero Engagement**: No email nurture sequence or follow-up communication
4. **Limited Analytics**: No email delivery/open tracking
5. **Trust Issues**: Users may perceive the lack of email as a technical failure or scam

### User Pain Points

- **Lead expectations not met**: Users provide their email expecting immediate value
- **No confirmation**: Users don't know if their submission succeeded
- **Missing materials**: The promised Diamond Sprint materials are not delivered
- **No next steps**: Users are redirected to the book page but receive no email guidance

### Business Impact

- **Conversion loss**: Leads may not engage further without immediate email contact
- **Brand perception**: Broken automation reflects poorly on professionalism
- **Manual overhead**: No automated lead nurturing means lost opportunities
- **Tracking blindness**: Cannot measure email engagement or conversion from email

---

## Requirements

### Functional Requirements

#### 1. Email Delivery System

**FR-1.1: Welcome Email**
- Send welcome email immediately after successful lead capture
- Include personalized greeting with email address
- Deliver promised Diamond Sprint materials (links, PDF attachments, or both)
- Set clear expectations for future communications
- Include unsubscribe link (legally required)

**FR-1.2: Email Content Structure**
- Professional HTML email template with brand colors (black, diamond blue #4fc3f7)
- Mobile-responsive design
- Plain text fallback version
- Header with logo/branding
- Clear call-to-action buttons
- Footer with legal links (privacy, terms, unsubscribe)

**FR-1.3: Error Handling**
- Graceful degradation if email service fails (still save lead to database)
- Log email delivery failures for admin review
- Retry logic for transient failures (3 attempts with exponential backoff)
- User-facing success message even if email is queued for later delivery

**FR-1.4: Email Tracking**
- Track email sends (success/failure) in database
- Store Resend email ID for debugging
- Optional: Track opens and clicks (Resend provides webhooks)

#### 2. Email Templates

**FR-2.1: Welcome Email Template**
```
Subject: Your Diamond Sprint Materials Are Here 💎

Content Structure:
- Personalized greeting
- Confirmation of successful registration
- Primary CTA: Access Diamond Sprint materials
- Brief overview of what they'll learn
- Secondary CTA: Book purchase link
- Social proof (testimonial snippet)
- Footer with legal links
```

**FR-2.2: Admin Notification Email** (Optional)
- Send to admin email when new lead captured
- Include lead details (email, UTM params, referrer)
- Quick link to admin dashboard

#### 3. Lead Status Management

**FR-3.1: Email Status Tracking**
- Add `email_sent_at` column to `leads` table (nullable datetime)
- Add `email_status` column: `pending`, `sent`, `failed`, `bounced`
- Add `email_id` column to store Resend email ID (nullable string)
- Update status after email delivery attempt

**FR-3.2: Retry Mechanism**
- Queue failed emails for retry (max 3 attempts)
- Exponential backoff: 1 minute, 5 minutes, 30 minutes
- Mark as permanently failed after 3 attempts

#### 4. Unsubscribe System

**FR-4.1: Unsubscribe Link**
- Generate unique unsubscribe token for each lead
- Add `unsubscribe_token` column to `leads` table (unique string)
- Create `/api/unsubscribe?token=xxx` endpoint
- Update `subscribed` status to `false` when unsubscribed

**FR-4.2: Preference Center** (Future Enhancement)
- Simple page at `/preferences?token=xxx`
- Allow users to update email frequency preferences
- Show current subscription status

### Technical Requirements

#### TR-1: Resend Configuration

**Environment Variables:**
```bash
RESEND_API_KEY=re_xxxxx           # Resend API key
RESEND_FROM_EMAIL=hello@becomingdiamond.com  # Verified sender
RESEND_ADMIN_EMAIL=admin@becomingdiamond.com # Admin notifications
```

**Dependencies:**
- `resend: ^6.1.2` (already installed ✓)
- Optional: `@react-email/components` for React-based templates

#### TR-2: Email Template Implementation

**Option A: React Email (Recommended)**
- Use `@react-email/components` for type-safe templates
- Store templates in `src/emails/` directory
- Render to HTML at send time
- Easier to maintain and preview

**Option B: HTML String Templates**
- Store HTML templates in `src/emails/` directory
- Use template literals with variables
- Faster but harder to maintain

#### TR-3: Database Schema Updates

```sql
-- Add email tracking columns to leads table
ALTER TABLE leads ADD COLUMN email_sent_at TEXT;
ALTER TABLE leads ADD COLUMN email_status TEXT DEFAULT 'pending';
ALTER TABLE leads ADD COLUMN email_id TEXT;
ALTER TABLE leads ADD COLUMN unsubscribe_token TEXT UNIQUE;
```

#### TR-4: API Route Updates

**Update `/api/leads` POST handler:**
1. After successful database insert
2. Generate unsubscribe token
3. Send welcome email via Resend
4. Store email delivery result (success/failure, email ID)
5. Update lead record with email status
6. Return success response to user (even if email queued)

**Create `/api/unsubscribe` handler:**
- Accept `token` query parameter
- Validate token exists in database
- Update `subscribed` to `false`
- Return confirmation page or JSON response

#### TR-5: Error Handling & Logging

- Wrap Resend calls in try-catch blocks
- Log all email delivery attempts to logger (`@/lib/logger`)
- Distinguish between permanent failures (invalid email) and transient failures (rate limits, network errors)
- Provide actionable error messages to admins

### Design Requirements

#### DR-1: Email Design System

**Brand Colors:**
- Background: `#000000` (black)
- Primary: `#4fc3f7` (diamond blue)
- Text: `#ffffff` (white)
- Secondary text: `#9ca3af` (gray-400)
- Borders: `rgba(255, 255, 255, 0.1)`

**Typography:**
- Font family: System fonts (Arial, Helvetica, sans-serif) for email compatibility
- Heading size: 24px (mobile), 32px (desktop)
- Body text: 16px
- Line height: 1.5

**Layout:**
- Max width: 600px (standard email width)
- Padding: 40px (desktop), 20px (mobile)
- Responsive breakpoint: 600px

#### DR-2: Email Template Structure

```
┌────────────────────────────────────┐
│  [Logo]                 Becoming   │
│                         Diamond    │
├────────────────────────────────────┤
│                                    │
│  Hi there! 👋                       │
│                                    │
│  Your Diamond Sprint materials     │
│  are ready...                      │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  Access Your Materials  ↗    │ │
│  └──────────────────────────────┘ │
│                                    │
│  What you'll get:                  │
│  ✓ 30-day transformation sprint   │
│  ✓ Daily presence exercises        │
│  ✓ Nervous system regulation      │
│                                    │
│  [Testimonial snippet]             │
│                                    │
│  Want the complete program?        │
│  [View Book] (secondary CTA)       │
│                                    │
├────────────────────────────────────┤
│  Privacy • Terms • Unsubscribe     │
│  © 2025 Becoming Diamond           │
└────────────────────────────────────┘
```

---

## Implementation Notes

### Phase 1: Core Email Delivery (MVP)

**Estimated Time:** 4-6 hours

**Tasks:**
1. Create Resend account and verify sending domain (30 min)
2. Add environment variables to `.env.local` and Vercel (10 min)
3. Update database schema with email tracking columns (20 min)
4. Create email template (HTML string or React Email) (2 hours)
5. Integrate Resend in `/api/leads` route (1 hour)
6. Test email delivery with test email addresses (30 min)
7. Implement error handling and logging (1 hour)

**Code Example: Resend Integration**

```typescript
// src/app/api/leads/route.ts
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // ... existing lead capture logic ...

    // Generate unsubscribe token
    const unsubscribeToken = nanoid(32);

    // Insert lead (including unsubscribe token)
    await turso.execute({
      sql: `INSERT INTO leads (..., unsubscribe_token) VALUES (..., ?)`,
      args: [...existingArgs, unsubscribeToken],
    });

    // Send welcome email
    try {
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: 'Your Diamond Sprint Materials Are Here 💎',
        react: WelcomeEmail({
          email,
          unsubscribeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?token=${unsubscribeToken}`
        }),
      });

      // Update lead with email delivery status
      await turso.execute({
        sql: `UPDATE leads SET email_sent_at = ?, email_status = ?, email_id = ? WHERE id = ?`,
        args: [new Date().toISOString(), 'sent', emailResult.id, id],
      });

      await log.info(`Welcome email sent to ${email}`, 'EMAIL', { emailId: emailResult.id });
    } catch (emailError) {
      // Log error but don't fail the API call
      await log.error(`Failed to send welcome email to ${email}`, 'EMAIL', emailError);

      // Mark email as failed for retry
      await turso.execute({
        sql: `UPDATE leads SET email_status = ? WHERE id = ?`,
        args: ['failed', id],
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks! Check your email for the Diamond Sprint materials.',
      leadId: id,
    });
  } catch (error) {
    // ... existing error handling ...
  }
}
```

**Email Template Example (React Email):**

```tsx
// src/emails/welcome-email.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
  unsubscribeUrl: string;
}

export function WelcomeEmail({ email, unsubscribeUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Diamond Sprint materials are ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Becoming Diamond 💎</Heading>

          <Text style={text}>Hi there!</Text>

          <Text style={text}>
            Thanks for joining the Diamond Sprint. Your materials are ready to access.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_BASE_URL}/app/sprint`}>
              Access Your Sprint Materials →
            </Button>
          </Section>

          <Text style={text}>
            Over the next 30 days, you'll learn to:
          </Text>

          <ul style={list}>
            <li>Master presence under pressure</li>
            <li>Regulate your nervous system</li>
            <li>Rewire your identity for unshakable clarity</li>
          </ul>

          <Section style={footer}>
            <Text style={footerText}>
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy`} style={link}>
                Privacy Policy
              </Link>
              {' • '}
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#000000', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' };
const h1 = { color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' };
const text = { color: '#ffffff', fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' };
const list = { color: '#ffffff', fontSize: '16px', paddingLeft: '20px' };
const buttonContainer = { margin: '32px 0' };
const button = {
  backgroundColor: '#4fc3f7',
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};
const footer = { marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' };
const footerText = { color: '#9ca3af', fontSize: '14px', textAlign: 'center' as const };
const link = { color: '#4fc3f7', textDecoration: 'underline' };
```

### Phase 2: Unsubscribe Functionality

**Estimated Time:** 2-3 hours

**Tasks:**
1. Create `/api/unsubscribe` route handler
2. Implement token validation and status update
3. Create simple unsubscribe confirmation page
4. Add unsubscribe link to email footer

**Code Example: Unsubscribe Handler**

```typescript
// src/app/api/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new NextResponse('Missing unsubscribe token', { status: 400 });
    }

    // Find lead by token
    const result = await turso.execute({
      sql: 'SELECT id, email FROM leads WHERE unsubscribe_token = ?',
      args: [token],
    });

    if (result.rows.length === 0) {
      return new NextResponse('Invalid unsubscribe token', { status: 404 });
    }

    const lead = result.rows[0];

    // Update subscription status
    await turso.execute({
      sql: 'UPDATE leads SET subscribed = 0, updated_at = ? WHERE id = ?',
      args: [new Date().toISOString(), lead.id],
    });

    // Return simple HTML confirmation
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px; text-align: center; }
            h1 { color: #4fc3f7; }
          </style>
        </head>
        <body>
          <h1>Successfully Unsubscribed</h1>
          <p>You've been removed from our mailing list.</p>
          <p>Email: ${lead.email}</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse('An error occurred', { status: 500 });
  }
}
```

### Phase 3: Email Analytics & Tracking (Optional)

**Estimated Time:** 3-4 hours

**Features:**
- Resend webhooks for open/click tracking
- Dashboard showing email performance
- A/B testing for subject lines
- Engagement scoring for leads

---

## Responsive Design

### Mobile Optimization

- **Single column layout** for all email content
- **Larger touch targets** for buttons (minimum 44x44px)
- **Reduced padding** on mobile (20px vs 40px desktop)
- **Responsive images** with max-width: 100%
- **Font sizes** remain consistent (16px body, 24-32px headings)

### Email Client Compatibility

Test emails in:
- Gmail (desktop, mobile)
- Apple Mail (iOS, macOS)
- Outlook (desktop, web)
- Yahoo Mail
- Proton Mail

Use **Litmus** or **Email on Acid** for cross-client testing (optional paid tool).

---

## Success Metrics

### Primary Metrics

1. **Email Delivery Rate**: >95% of emails successfully delivered
2. **Email Open Rate**: >20% (industry average for welcome emails: 50-60%)
3. **Click-Through Rate**: >10% on primary CTA
4. **Bounce Rate**: <2% (hard bounces)
5. **Unsubscribe Rate**: <0.5% (typical for first email)

### Secondary Metrics

1. **Lead-to-Customer Conversion**: Track if email recipients purchase book
2. **Email-to-App Conversion**: Track if users access member portal from email
3. **Time to First Email**: <30 seconds from form submission
4. **Email Deliverability Score**: Monitor sender reputation

### Monitoring & Alerts

- **Slack/Email alerts** for failed email sends (>5% failure rate)
- **Daily digest** of email performance stats
- **Weekly report** of lead quality and conversion

---

## Future Enhancements

### Short-term (1-3 months)

1. **Welcome Email Sequence**: 5-day automated drip campaign
   - Day 1: Welcome + materials delivery
   - Day 3: "How to get started" guide
   - Day 5: Success stories + book CTA
   - Day 7: Last chance offer or reminder

2. **Segmentation**: Tag leads by source (UTM params) for targeted messaging

3. **Personalization**: Dynamic content based on user behavior
   - Open vs. non-opens
   - Clicked specific links
   - Time of day optimization

4. **Re-engagement Campaign**: Email dormant leads after 30 days

### Long-term (3-6 months)

1. **Advanced Analytics Dashboard**:
   - Cohort analysis (conversion by acquisition date)
   - Email heatmaps (where users click)
   - A/B test results visualization

2. **SMS Integration**: Optional SMS notifications for high-value content

3. **Preference Center**: Allow users to choose email frequency and topics

4. **AI-Powered Send Time Optimization**: Send emails when user is most likely to engage

5. **Behavioral Triggers**:
   - Abandoned cart emails (if book added but not purchased)
   - Course completion celebrations
   - Milestone achievements

---

## Security & Compliance

### Legal Requirements

1. **CAN-SPAM Act Compliance** (US):
   - Include physical mailing address in footer
   - Honor opt-out requests within 10 business days
   - Clearly identify message as advertisement (if applicable)

2. **GDPR Compliance** (EU):
   - Explicit consent checkbox (already implemented ✓)
   - Right to be forgotten (unsubscribe)
   - Data portability (export leads via API)

3. **CASL Compliance** (Canada):
   - Explicit consent required
   - Unsubscribe mechanism in every email

### Data Protection

1. **API Key Security**:
   - Store Resend API key in environment variables only
   - Never commit to version control
   - Rotate keys quarterly

2. **Email Content Security**:
   - Sanitize user input before including in emails
   - Prevent email injection attacks
   - Use HTTPS for all links

3. **Unsubscribe Token Security**:
   - Use cryptographically secure random tokens (nanoid)
   - Make tokens unguessable (minimum 32 characters)
   - Invalidate tokens after use (optional)

---

## Testing Checklist

### Pre-Launch Testing

- [ ] Send test emails to multiple email providers (Gmail, Outlook, Apple Mail)
- [ ] Verify all links work (CTAs, unsubscribe, privacy policy)
- [ ] Test mobile rendering on iOS and Android
- [ ] Verify unsubscribe flow works correctly
- [ ] Check email lands in inbox (not spam)
- [ ] Test with invalid email addresses (handle errors gracefully)
- [ ] Verify database updates occur correctly
- [ ] Test rate limiting doesn't block legitimate users
- [ ] Confirm admin notifications work (if implemented)
- [ ] Load test: Submit 10 leads in quick succession

### Post-Launch Monitoring

- [ ] Monitor email delivery rates in Resend dashboard
- [ ] Check error logs for failed sends
- [ ] Review unsubscribe rate (should be <1% for first email)
- [ ] Monitor bounce rate (should be <2%)
- [ ] Track open rate (target >20%)
- [ ] Verify no spam complaints
- [ ] Check sender reputation score (tools: SendGrid, Google Postmaster)

---

## Dependencies

### Required

- **Resend account**: Free tier supports 100 emails/day, 3,000/month
- **Verified sending domain**: Required for production (e.g., hello@becomingdiamond.com)
- **Database schema updates**: Add email tracking columns to `leads` table

### Optional

- **@react-email/components**: For React-based email templates (recommended)
- **Email testing service**: Litmus ($99/month) or Email on Acid ($99/month)
- **Monitoring service**: Sentry for error tracking, Slack for alerts

---

## Deployment Checklist

- [ ] Create Resend account at https://resend.com
- [ ] Add and verify sending domain (DNS records)
- [ ] Generate API key from Resend dashboard
- [ ] Add environment variables to Vercel:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `RESEND_ADMIN_EMAIL` (optional)
  - `NEXT_PUBLIC_BASE_URL`
- [ ] Run database migration to add email tracking columns
- [ ] Deploy updated API route and email templates
- [ ] Test email delivery in production
- [ ] Monitor first 100 emails for issues
- [ ] Set up Resend webhooks for tracking (optional)
- [ ] Configure monitoring and alerts

---

## Notes

### Why Resend?

Resend was chosen over alternatives (SendGrid, Mailgun, AWS SES) for:
- **Developer experience**: Simple API, TypeScript support, React Email integration
- **Pricing**: Generous free tier (3,000 emails/month), affordable paid plans
- **Deliverability**: Built by developers, optimized for transactional emails
- **Modern stack**: Native React Email support, webhook-first approach
- **Already installed**: `resend` package is present in project dependencies

### Diamond Sprint Materials Delivery

The PRD assumes Diamond Sprint materials are:
1. **Web-based**: Link to `/app/sprint` member portal
2. **PDF download**: Link to PDF file in Resend CDN or Vercel Blob storage
3. **Email attachment**: Attach PDF to welcome email (not recommended, increases spam risk)

**Recommendation**: Use web-based delivery (option 1) with optional PDF download link. This:
- Reduces email size (better deliverability)
- Allows content updates without resending emails
- Provides better analytics (page views, completion tracking)
- Enables gated content (require account creation for access)

### Spam Prevention Best Practices

1. **Warm up sending domain**: Start with low volume, gradually increase
2. **Authenticate domain**: Set up SPF, DKIM, and DMARC records
3. **Clean list**: Remove bounces and inactive emails
4. **Monitor reputation**: Use Google Postmaster Tools
5. **Avoid spam trigger words**: Free, guarantee, click here, etc.
6. **Maintain text-to-image ratio**: >60% text in email body

---

## Approval

**Product Owner:** _____________________
**Engineering Lead:** _____________________
**Date:** _____________________

---

**End of PRD**
