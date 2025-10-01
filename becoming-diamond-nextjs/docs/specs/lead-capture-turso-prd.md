# PRD: Lead Capture with Turso SQLite Database

**Product:** Becoming Diamond - Lead Capture System
**Version:** 1.0
**Status:** Planning
**Last Updated:** 2025-10-01
**Owner:** Development Team

---

## Executive Summary

Integrate Turso SQLite database to capture and store lead information from the "Turning Pressure Into Power" free download landing page. This system will replace the current client-side-only form with a persistent database solution that enables lead nurturing, analytics, and email automation.

---

## Problem Statement

**Current State:**
- Lead capture form exists on landing page (`/` route)
- Form submission has no backend integration
- Email addresses are not persisted
- No lead tracking or analytics
- No way to follow up with prospects
- No data for conversion analysis

**Desired State:**
- Email addresses captured and stored in Turso SQLite database
- Lead source tracking (landing page, campaign, referrer)
- Timestamp and metadata for each lead
- Foundation for email automation integration
- Analytics on lead conversion funnel
- GDPR-compliant data handling

---

## Goals & Success Metrics

### Primary Goals
1. Capture all lead submissions to persistent database
2. Track lead source and acquisition metadata
3. Enable export for email marketing platforms
4. Provide foundation for future automation

### Success Metrics
- **Capture Rate:** 95%+ of form submissions successfully stored
- **Response Time:** <500ms from submit to confirmation
- **Data Quality:** <1% duplicate or invalid entries
- **Uptime:** 99.9% database availability
- **Privacy Compliance:** 100% GDPR-compliant consent tracking

### Non-Goals (Phase 1)
- Email automation/sending (use export to existing platforms)
- Lead scoring or qualification
- CRM integration
- A/B testing infrastructure
- Multi-step forms or progressive profiling

---

## User Stories

### Core User Stories

**US-1: Submit Lead Information**
> As a visitor, I want to submit my email to get the free Diamond Sprint materials, so that I can start my personal development journey.

**Acceptance Criteria:**
- Form submission captures email address
- Success message displays after submission
- Duplicate submissions are handled gracefully
- Email validation prevents invalid entries
- Form clears after successful submission

**US-2: Track Lead Source**
> As a marketer, I want to know where leads came from, so that I can optimize acquisition channels.

**Acceptance Criteria:**
- UTM parameters are captured and stored
- Referrer URL is tracked
- Landing page variant (if any) is recorded
- Timestamp of submission is recorded
- Device type (mobile/desktop) is tracked

**US-3: Export Leads for Marketing**
> As a marketer, I want to export leads to my email platform, so that I can send nurture campaigns.

**Acceptance Criteria:**
- Can export leads as CSV
- Can filter by date range
- Can filter by lead source
- Export includes all relevant metadata
- Export respects privacy preferences

**US-4: Prevent Duplicate Submissions**
> As a user, I don't want to accidentally submit my email multiple times, so that I don't get duplicate communications.

**Acceptance Criteria:**
- Duplicate emails within 24 hours are prevented
- User sees friendly message for duplicates
- Can resubmit after 24 hours if desired
- Admin can override duplicate prevention

---

## Technical Specification

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Landing Page Form                       │
│  - Email input field                            │
│  - Submit button                                │
│  - Privacy consent                              │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         API Route: /api/leads                   │
│  - POST handler                                 │
│  - Email validation                             │
│  - Duplicate checking                           │
│  - UTM/metadata extraction                      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Turso SQLite Database                   │
│  - leads table                                  │
│  - Distributed edge database                    │
│  - libSQL protocol                              │
└─────────────────────────────────────────────────┘
```

### Database Schema

#### Leads Table
```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  -- Lead Source Tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  landing_page TEXT,

  -- Device & Location
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,

  -- Status & Flags
  status TEXT DEFAULT 'new',
  consent_given INTEGER DEFAULT 0,
  subscribed INTEGER DEFAULT 1,

  -- Metadata
  notes TEXT,
  tags TEXT
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_utm_source ON leads(utm_source);
```

#### Status Values
- `new`: Just submitted, not yet contacted
- `contacted`: Initial email sent
- `engaged`: Opened emails or clicked links
- `converted`: Became paying customer
- `unsubscribed`: Opted out of communications

### Data Models

#### Lead (TypeScript)
```typescript
interface Lead {
  id: string;
  email: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601

  // Lead Source
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage: string;

  // Device & Location
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;

  // Status
  status: 'new' | 'contacted' | 'engaged' | 'converted' | 'unsubscribed';
  consentGiven: boolean;
  subscribed: boolean;

  // Metadata
  notes?: string;
  tags?: string[]; // Stored as JSON string
}
```

#### LeadSubmission (Form Input)
```typescript
interface LeadSubmission {
  email: string;
  consentGiven: boolean;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  referrer?: string;
  landingPage: string;
}
```

### API Endpoints

#### POST /api/leads
**Purpose:** Create new lead from form submission

**Request Body:**
```json
{
  "email": "user@example.com",
  "consentGiven": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thanks! Check your email for the Diamond Sprint materials.",
  "leadId": "lead_abc123"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "This email is already registered. Check your inbox!"
}
```

**Rate Limiting:**
- 5 requests per minute per IP
- 10 requests per hour per IP
- Return 429 with Retry-After header

---

#### GET /api/leads (Admin Only)
**Purpose:** Export leads for marketing

**Query Parameters:**
- `startDate`: ISO date (optional)
- `endDate`: ISO date (optional)
- `source`: UTM source filter (optional)
- `status`: Status filter (optional)
- `format`: `json` or `csv` (default: `json`)

**Success Response (200):**
```json
{
  "leads": [
    {
      "id": "lead_abc123",
      "email": "user@example.com",
      "createdAt": "2025-10-01T12:00:00Z",
      "utmSource": "facebook",
      ...
    }
  ],
  "total": 142,
  "page": 1,
  "pageSize": 100
}
```

**CSV Response:**
```csv
email,created_at,utm_source,utm_medium,status
user@example.com,2025-10-01T12:00:00Z,facebook,cpc,new
```

**Authentication:**
- Require admin API key in `Authorization` header
- Use environment variable for key
- Return 401 if unauthorized

---

### Turso Integration

**Setup:**
1. Install Turso SDK: `npm install @libsql/client`
2. Create Turso database: `turso db create becoming-diamond-leads`
3. Get database URL: `turso db show becoming-diamond-leads`
4. Generate auth token: `turso db tokens create becoming-diamond-leads`

**Environment Variables:**
```bash
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
ADMIN_API_KEY=your-admin-key
```

**Client Configuration:**
```typescript
import { createClient } from '@libsql/client';

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

**Query Examples:**
```typescript
// Insert lead
await turso.execute({
  sql: `INSERT INTO leads (id, email, created_at, utm_source, ...)
        VALUES (?, ?, ?, ?, ...)`,
  args: [id, email, timestamp, utmSource, ...]
});

// Check duplicate
const result = await turso.execute({
  sql: 'SELECT id FROM leads WHERE email = ? AND created_at > ?',
  args: [email, twentyFourHoursAgo]
});

// Get leads with filters
const leads = await turso.execute({
  sql: `SELECT * FROM leads
        WHERE created_at >= ? AND created_at <= ?
        AND utm_source = ?
        ORDER BY created_at DESC
        LIMIT ?`,
  args: [startDate, endDate, source, pageSize]
});
```

---

### Form Integration

**Current Form Location:** `src/app/page.tsx` (around line 850-950)

**Form Changes Required:**
1. Add `onSubmit` handler to call API
2. Add loading state during submission
3. Add success/error message display
4. Extract UTM parameters from URL
5. Capture referrer and landing page URL

**Updated Form Component:**
```typescript
'use client';

import { useState } from 'react';

export function LeadCaptureForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setStatus('error');
      setMessage('Please agree to receive emails to continue.');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consentGiven: consent
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setConsent(false);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={loading}
        className="..."
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={loading}
        />
        <span>I agree to receive emails with the free materials and updates.</span>
      </label>

      <button
        type="submit"
        disabled={loading || !consent}
        className="..."
      >
        {loading ? 'Submitting...' : 'Yes, I Want the Free Diamond Sprint'}
      </button>

      {status === 'success' && (
        <div className="text-green-400 text-sm">{message}</div>
      )}

      {status === 'error' && (
        <div className="text-red-400 text-sm">{message}</div>
      )}
    </form>
  );
}
```

**UTM Parameter Extraction:**
```typescript
// Utility to extract UTM params from URL
export function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
  };
}

// Include in form submission
const utmParams = getUtmParams();
const referrer = document.referrer || undefined;
const landingPage = window.location.href;
```

---

### Security & Privacy

**Data Security:**
- HTTPS only (enforced by Vercel)
- Turso auth token stored in environment variables
- No sensitive data in client-side code
- Admin API protected with key authentication
- IP addresses hashed or anonymized (GDPR)

**Privacy Compliance (GDPR/CCPA):**
- Explicit consent checkbox required
- Clear privacy policy link
- Unsubscribe mechanism in every email
- Right to deletion (admin endpoint)
- Data retention policy (24 months)
- Cookie consent (if tracking enabled)

**Rate Limiting:**
- Prevent spam submissions
- Per-IP throttling
- Exponential backoff for repeated failures
- CAPTCHA for suspicious activity (future)

**Validation:**
- Email format validation (regex)
- Domain validation (check MX records - optional)
- Disposable email detection (optional)
- XSS prevention (sanitize inputs)

---

## Implementation Phases

### Phase 1: Database Setup (1 day)
**Goal:** Set up Turso database and schema

**Tasks:**
- Create Turso database
- Define leads table schema
- Add indexes for performance
- Configure environment variables
- Test database connection
- Write seed data for testing

**Deliverables:**
- Turso database instance
- Schema migration script
- Connection utility (`/src/lib/turso.ts`)

**Acceptance Criteria:**
- Database accessible from Next.js API routes
- Schema created with all fields
- Test queries execute successfully
- Environment variables configured

---

### Phase 2: API Endpoint (2 days)
**Goal:** Build lead capture API

**Tasks:**
- Create `/api/leads/route.ts`
- Implement POST handler for lead creation
- Add email validation
- Add duplicate checking (24-hour window)
- Extract and store UTM parameters
- Add error handling and logging
- Write API tests

**Deliverables:**
- POST /api/leads endpoint
- Lead creation logic
- Duplicate prevention
- Error responses

**Acceptance Criteria:**
- Leads are successfully stored
- Duplicate emails are handled gracefully
- UTM parameters are captured
- Proper error messages returned
- Response time <500ms

---

### Phase 3: Form Integration (1 day)
**Goal:** Connect form to API

**Tasks:**
- Update form component in `page.tsx`
- Add submit handler
- Add loading states
- Add success/error messages
- Extract UTM parameters client-side
- Capture referrer and landing page
- Style success/error states

**Deliverables:**
- Updated lead capture form
- Client-side UTM extraction
- Success/error UI

**Acceptance Criteria:**
- Form submits to /api/leads
- Loading state displays during submission
- Success message shows on completion
- Error messages show on failure
- Form clears after success
- UTM params are sent to API

---

### Phase 4: Admin Export (1 day)
**Goal:** Enable lead export for marketing

**Tasks:**
- Create GET /api/leads endpoint
- Add admin authentication
- Implement date range filters
- Implement source filters
- Add CSV export format
- Add pagination
- Write export documentation

**Deliverables:**
- GET /api/leads endpoint
- CSV export functionality
- Admin authentication

**Acceptance Criteria:**
- Can export leads as JSON
- Can export leads as CSV
- Filters work correctly
- Admin key required
- Pagination works for large datasets

---

### Phase 5: Testing & Launch (1 day)
**Goal:** Test and deploy

**Tasks:**
- End-to-end testing
- Load testing (concurrent submissions)
- Edge case testing (duplicates, invalid emails)
- Privacy policy review
- Deploy to production
- Monitor initial submissions

**Deliverables:**
- Tested lead capture system
- Production deployment
- Monitoring setup

**Acceptance Criteria:**
- All tests pass
- No console errors
- Leads are captured successfully
- Export works in production
- GDPR compliance verified

---

## Technical Requirements

### Infrastructure
- **Database:** Turso SQLite (edge-replicated)
- **Hosting:** Vercel Edge Functions
- **Region:** Global (edge deployment)

### Dependencies
```json
{
  "@libsql/client": "^0.6.0"
}
```

### Environment Variables
```bash
# Required
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
ADMIN_API_KEY=random-secure-key

# Optional
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key (future)
```

### Performance Targets
- **API Response Time:** <500ms (p95)
- **Database Query Time:** <100ms (p95)
- **Form Submission Success Rate:** >95%
- **Edge Replication Latency:** <50ms

### Monitoring
- Database query performance
- API error rates
- Lead submission success rates
- Duplicate detection rates
- Export usage

---

## Privacy & Compliance

### GDPR Requirements
1. **Lawful Basis:** Consent (checkbox)
2. **Transparency:** Clear privacy policy link
3. **Right to Access:** Export leads endpoint
4. **Right to Deletion:** Delete endpoint (admin)
5. **Data Minimization:** Only collect necessary data
6. **Security:** Encrypted storage (Turso default)

### Privacy Policy Updates Needed
- Add section on lead capture
- Explain data usage (email marketing)
- Link to unsubscribe mechanism
- Describe data retention (24 months)
- Explain third-party sharing (email platforms)

### Consent Mechanism
- Clear checkbox label: "I agree to receive the free Diamond Sprint materials and occasional updates via email."
- Link to privacy policy: "By submitting, you agree to our [Privacy Policy](#)"
- Unchecked by default (must opt-in)

---

## Future Enhancements

### Phase 2 Features
- **Lead Scoring:** Qualify leads based on engagement
- **Email Automation:** Drip campaigns via Resend/Mailgun
- **Lead Magnet Delivery:** Automated email with download link
- **A/B Testing:** Test form variations
- **Progressive Profiling:** Collect more data over time

### Integration Opportunities
- **ConvertKit/Mailchimp:** Sync leads automatically
- **Zapier:** Trigger workflows on new leads
- **Google Sheets:** Real-time export
- **Slack:** Notifications for new leads
- **Analytics:** Enhanced conversion tracking

### Advanced Features
- **CAPTCHA:** Prevent bot submissions
- **Email Verification:** Double opt-in
- **Lead Enrichment:** Append data from Clearbit/FullContact
- **Segmentation:** Tag leads by behavior
- **Webhooks:** Notify external systems

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Turso service downtime | High | Low | Cache submissions client-side, retry logic |
| Spam submissions | Medium | High | Rate limiting, CAPTCHA, duplicate prevention |
| GDPR non-compliance | High | Low | Legal review, explicit consent, clear policies |
| Database query performance | Medium | Low | Indexes on key fields, edge replication |
| Lost leads (API errors) | High | Low | Retry logic, error logging, dead letter queue |
| Privacy policy unclear | Medium | Medium | Legal review, plain language, examples |

---

## Success Criteria

### Phase 1 Success
- ✅ Turso database created and accessible
- ✅ Schema migrated successfully
- ✅ Test queries execute <100ms

### Phase 2 Success
- ✅ API endpoint handles submissions
- ✅ Duplicate prevention works
- ✅ UTM tracking captures data

### Phase 3 Success
- ✅ Form submits successfully
- ✅ Success/error messages display
- ✅ UTM params extracted and sent

### Phase 4 Success
- ✅ Leads exportable as CSV/JSON
- ✅ Filters work correctly
- ✅ Admin authentication required

### Phase 5 Success
- ✅ All tests pass
- ✅ Production deployment successful
- ✅ First 10 leads captured

### Overall Success
- 📊 95%+ submission success rate
- 📊 <1% duplicate entries
- 📊 <500ms API response time (p95)
- 📊 100% GDPR-compliant
- 📊 Easy export for marketing team

---

## Appendix

### Glossary
- **Lead:** Person who submitted email for free materials
- **UTM Parameters:** Tracking codes in URL for campaign attribution
- **Edge Database:** Globally distributed database (low latency)
- **libSQL:** SQLite-compatible protocol used by Turso

### References
- Turso Documentation: https://docs.turso.tech/
- GDPR Compliance Guide: https://gdpr.eu/
- Landing Page Form: `/src/app/page.tsx:850-950`

### Changelog
- 2025-10-01: Initial PRD created for Turso integration
