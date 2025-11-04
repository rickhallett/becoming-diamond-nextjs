# E2E Test Coverage Implementation Plan

## Overview

This document outlines the implementation plan for comprehensive E2E test coverage across all user workflows in the Becoming Diamond application. The plan identifies missing test coverage, prioritizes implementation phases, and defines success criteria.

## Current State

### Existing E2E Tests
- `landing.spec.ts` - Basic landing page functionality (4 tests)
- `landing-extended.spec.ts` - Extended landing scenarios (6 tests, 3 skipped)
- `member-portal.spec.ts` - Basic navigation (4 tests)
- `member-portal-extended.spec.ts` - Extended navigation (7 tests, 3 skipped)
- `course-playback.spec.ts` - Course viewing (8 tests, 4 skipped)
- `payment-flow.spec.ts` - Stripe integration (7 tests, 6 skipped)
- `oauth-flow.spec.ts` - CMS authentication (8 tests, 6 skipped)

### Coverage Gaps
- Authentication workflows (sign-in, sign-out, session management)
- Sprint features (dashboard, daily challenges, activities)
- Course interactions (slide navigation, completion, progress)
- Video playback controls and tracking
- Chat/AI interactions
- Profile and settings management
- Newsletter submission with API integration
- Payment completion flows
- Content management workflows

## Implementation Phases

### Phase 1: Authentication Flows
**Priority:** Critical
**Estimated Effort:** 3-4 days
**File:** `src/test/e2e/auth-flow.spec.ts`

#### Test Scenarios

**1.1 Email Magic Link Sign-In**
- User enters email on sign-in page
- API creates magic link token
- User receives email (mocked/test inbox)
- User clicks magic link
- Session created successfully
- User redirected to dashboard

**1.2 Sign-Out Flow**
- Authenticated user clicks sign-out button
- Session cleared from cookies
- User redirected to landing page
- Protected routes now redirect to auth

**1.3 Session Persistence**
- User signs in successfully
- User refreshes page
- Session remains valid
- User data persists
- No re-authentication required

**1.4 Protected Route Redirect**
- Unauthenticated user navigates to `/app/courses`
- Automatically redirected to `/auth/signin`
- Redirect URL preserved in query params
- After sign-in, redirected back to `/app/courses`

**1.5 Session Expiration**
- User with expired session accesses protected route
- Session validation fails
- User redirected to sign-in
- Error message displayed (if applicable)

**1.6 Invalid Token Handling**
- User clicks magic link with invalid token
- Error page displayed with clear message
- Link to request new magic link
- No session created

#### Dependencies
- Email testing infrastructure (Mailosaur, MailHog, or mock email service)
- Auth fixture generation utility
- Test user management system

#### Success Criteria
- 100% pass rate on all authentication scenarios
- Tests run independently without state dependencies
- Average test execution time < 30 seconds per scenario
- Clear error messages on test failures

---

### Phase 2: Sprint Features
**Priority:** High
**Estimated Effort:** 4-5 days
**File:** `src/test/e2e/sprint.spec.ts`

#### Test Scenarios

**2.1 Sprint Dashboard Overview**
- User navigates to `/app/sprint`
- Dashboard displays current day progress
- Shows completed vs remaining days
- Displays overall sprint completion percentage
- "Start Today's Challenge" CTA visible

**2.2 Daily Challenge Navigation**
- User clicks on specific day card
- Navigates to `/app/sprint/day/[dayNumber]`
- Day content loads correctly
- Activities displayed in order
- Progress indicator shows current position

**2.3 Activity Completion**
- User completes activity (checkbox/button)
- Activity marked as complete
- Progress updates in real-time
- Completion persists on page reload
- Next activity unlocked (if sequential)

**2.4 Sprint Watch Page**
- User navigates to `/app/sprint/watch`
- Video player loads successfully
- Current day's video displays
- Playback controls functional
- Progress tracked

**2.5 Sprint Progress Dashboard**
- User navigates to `/app/sprint/dashboard`
- All 30 days displayed
- Completed days marked visually
- Current day highlighted
- Statistics summary visible (completion rate, streak)

**2.6 Day-to-Day Progression**
- User completes all activities for day 5
- Day 5 marked complete
- Day 6 becomes accessible
- User can navigate to day 6
- Previous days remain accessible

**2.7 Mobile Responsiveness**
- Sprint features tested on mobile viewport (375x667)
- Touch interactions work correctly
- Layouts adapt properly
- No horizontal scroll issues

#### Dependencies
- Authenticated user fixture
- Test sprint data (sample 30-day content)
- Activity completion API endpoints
- Progress tracking database/state

#### Success Criteria
- All sprint workflows functional end-to-end
- Progress persistence verified
- Mobile and desktop viewports tested
- Activity state management validated

---

### Phase 3: Course Interactions
**Priority:** High
**Estimated Effort:** 4-5 days
**File:** `src/test/e2e/course-interactions.spec.ts`

#### Test Scenarios

**3.1 Course Slide Navigation**
- User opens course viewer
- Clicks "Next Slide" button
- Slide advances to next content
- URL updates with slide number
- Previous slide accessible via "Previous" button
- Keyboard navigation works (arrow keys)

**3.2 Slide Completion Marking**
- User views slide content
- Clicks "Mark Complete" button
- Slide marked with checkmark/indicator
- Completion status persists
- Progress bar updates
- Sidebar shows completion status

**3.3 Course Progress Persistence**
- User completes slides 1-3
- User closes browser/tab
- User reopens course
- Returns to last viewed slide (slide 3)
- Completed slides remain marked
- Progress percentage accurate

**3.4 Activity Interactions**
- User encounters interactive activity in slide
- Activity renders correctly
- User completes activity (form/quiz/exercise)
- Activity submission processes
- Feedback displayed
- Activity completion recorded

**3.5 Course Completion**
- User completes all slides in course
- Course marked as complete in dashboard
- Completion certificate/badge awarded (if applicable)
- Course progress shows 100%
- Next course recommended

**3.6 Resume Course**
- User previously started course (stopped at slide 7)
- User navigates to course from dashboard
- "Resume" button visible
- Clicking resume takes to slide 7
- "Start from beginning" option available

**3.7 Course Sidebar Navigation**
- User opens course sidebar
- All slides listed
- Completed slides visually distinct
- Clicking slide navigates directly
- Current slide highlighted
- Locked slides not clickable (if sequential)

#### Dependencies
- Authenticated user fixture
- Test course with multiple slides
- Activity rendering infrastructure
- Progress tracking API endpoints

#### Success Criteria
- Seamless navigation between slides
- Progress tracking accuracy 100%
- Activity interactions validated
- Persistence across sessions verified

---

### Phase 4: Video Playback
**Priority:** High
**Estimated Effort:** 3-4 days
**File:** Enhancement to `src/test/e2e/course-playback.spec.ts`

#### Test Scenarios (Unskip Existing)

**4.1 Video Player Rendering**
```typescript
test('user can view video player on course slide', async ({ page }) => {
  // Load authenticated state
  await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');

  // Navigate to slide with video
  await page.getByRole('button', { name: /slide 1/i }).click();

  // Video player visible
  const video = page.locator('video');
  await expect(video).toBeVisible({ timeout: 10000 });

  // Video has source
  const src = await video.getAttribute('src');
  expect(src).toBeTruthy();
});
```

**4.2 Video Token API Authentication**
```typescript
test('video token API is called for protected content', async ({ page }) => {
  await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');

  // Wait for token API call
  const tokenResponse = await page.waitForResponse(
    resp => resp.url().includes('/api/video/') && resp.url().includes('/token')
  );

  expect(tokenResponse.ok()).toBeTruthy();

  // Token response contains HLS URL
  const data = await tokenResponse.json();
  expect(data.streamUrl).toMatch(/\.m3u8$/);
});
```

**4.3 Playback Controls**
```typescript
test('video playback controls work', async ({ page }) => {
  await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');

  const video = page.locator('video');

  // Initially paused
  let isPaused = await video.evaluate(v => (v as HTMLVideoElement).paused);
  expect(isPaused).toBe(true);

  // Click play button
  const playButton = page.getByRole('button', { name: /play/i });
  await playButton.click();
  await page.waitForTimeout(1000);

  // Video playing
  isPaused = await video.evaluate(v => (v as HTMLVideoElement).paused);
  expect(isPaused).toBe(false);

  // Click pause
  const pauseButton = page.getByRole('button', { name: /pause/i });
  await pauseButton.click();

  // Video paused
  isPaused = await video.evaluate(v => (v as HTMLVideoElement).paused);
  expect(isPaused).toBe(true);
});
```

**4.4 Progress Tracking**
```typescript
test('progress tracking persists across slides', async ({ page }) => {
  await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');

  // Watch 50% of video on slide 1
  const video = page.locator('video');
  await video.evaluate(v => {
    (v as HTMLVideoElement).currentTime = (v as HTMLVideoElement).duration * 0.5;
  });

  // Navigate to slide 2
  await page.getByRole('button', { name: /next slide/i }).click();

  // Navigate back to slide 1
  await page.getByRole('button', { name: /previous slide/i }).click();

  // Progress restored
  const currentTime = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
  const duration = await video.evaluate(v => (v as HTMLVideoElement).duration);
  const progress = currentTime / duration;

  expect(progress).toBeCloseTo(0.5, 1);
});
```

**4.5 Video Loading States**
- Player shows loading spinner while video loads
- Error state displayed if video fails to load
- Retry mechanism available
- Fallback content if token expired

**4.6 Autoplay Behavior**
- Video autoplays if `autoplay` attribute set
- Respects user's autoplay preferences
- Muted autoplay on mobile (browser policy)

#### Dependencies
- Bunny Stream test environment
- Video token API implementation (`/api/video/[videoId]/token`)
- HLS.js integration
- Test video assets

#### Success Criteria
- All skipped tests passing
- Video playback smooth across browsers
- Token authentication validated
- Progress tracking accurate to within 2 seconds

---

### Phase 5: Chat/DiamondMindAI
**Priority:** Medium
**Estimated Effort:** 3-4 days
**File:** `src/test/e2e/chat-interaction.spec.ts`

#### Test Scenarios

**5.1 Chat Interface Rendering**
- User navigates to `/app/chat`
- Chat interface loads
- Message input field visible
- Send button visible
- Chat history container exists
- Welcome message displayed (if applicable)

**5.2 Message Sending**
- User types message in input field
- User clicks send button (or presses Enter)
- Message appears in chat history
- Message aligned to right (user message)
- Input field cleared
- Timestamp displayed

**5.3 AI Response Display**
- User sends message
- Loading indicator appears
- API call to AI endpoint
- AI response received
- Response displayed in chat history
- Response aligned to left (AI message)
- Markdown formatting rendered

**5.4 Chat History Persistence**
- User sends 5 messages
- User refreshes page
- Chat history persists
- All 5 messages visible
- Scroll position preserved
- New messages append to history

**5.5 Error Handling**
- User sends message while offline
- Error message displayed
- Retry option available
- User clicks retry
- Message sent successfully

**5.6 Loading States**
- User sends message
- Send button disabled during processing
- Loading indicator visible
- User cannot send duplicate messages
- UI re-enabled after response

**5.7 Markdown Support**
- AI sends response with markdown (code blocks, lists, bold)
- Markdown rendered correctly
- Code syntax highlighting applied
- Links clickable
- Images displayed (if supported)

**5.8 Long Conversation Scrolling**
- Chat history has 50+ messages
- Scroll to bottom button visible
- Clicking button scrolls to latest message
- Auto-scroll on new message
- Scroll performance smooth

#### Dependencies
- AI API endpoint (`/api/chat`)
- Mock AI responses for deterministic testing
- Chat history persistence (database/localStorage)
- Markdown rendering library

#### Success Criteria
- Real-time message updates
- Reliable error handling
- Markdown rendering validated
- Performance acceptable with 100+ messages

---

### Phase 6: Profile Management
**Priority:** Medium
**Estimated Effort:** 2-3 days
**File:** `src/test/e2e/profile.spec.ts`

#### Test Scenarios

**6.1 Profile Page Display**
- User navigates to `/app/profile`
- Profile information displayed (name, email, avatar)
- Statistics section visible (courses completed, sprint progress)
- Account created date visible
- Edit profile button visible

**6.2 Profile Editing**
- User clicks "Edit Profile" button
- Form fields become editable
- User updates name field
- User clicks "Save"
- Profile updated successfully
- Success message displayed
- New name reflected in UI

**6.3 Avatar Upload**
- User clicks "Change Avatar" button
- File upload dialog opens
- User selects image file
- Image preview displayed
- User clicks "Upload"
- Avatar updated successfully
- New avatar visible across app (sidebar, profile)

**6.4 Progress Statistics**
- Profile displays course completion stats
- Shows sprint progress (days completed)
- Displays total watch time
- Shows achievements/badges (if applicable)
- Statistics update in real-time

**6.5 Form Validation**
- User attempts to save profile with empty name
- Validation error displayed
- Form submission blocked
- User enters valid name
- Form submits successfully

**6.6 Data Persistence**
- User updates profile
- User logs out
- User logs back in
- Profile changes persisted
- Data matches last saved state

#### Dependencies
- Authenticated user fixture
- Profile API endpoints (`/api/user/profile`)
- File upload infrastructure (if avatar upload implemented)
- Form validation logic

#### Success Criteria
- Profile updates reflected immediately
- Validation prevents invalid data
- Avatar upload functional (if implemented)
- Statistics accurate and real-time

---

### Phase 7: Settings
**Priority:** Medium
**Estimated Effort:** 2-3 days
**File:** `src/test/e2e/settings.spec.ts`

#### Test Scenarios

**7.1 Settings Page Navigation**
- User navigates to `/app/settings`
- Settings page loads
- All settings sections visible
- Current settings values populated
- Save button visible

**7.2 Notification Preferences**
- User toggles email notification checkbox
- User toggles push notification checkbox
- User clicks "Save Settings"
- Settings saved successfully
- Preferences persist on page reload

**7.3 Privacy Settings**
- User updates privacy preferences
- User changes data sharing settings
- User clicks "Save"
- Settings updated
- Confirmation message displayed

**7.4 Account Settings**
- User updates timezone setting
- User changes language preference (if multi-language)
- User saves settings
- Settings applied immediately
- UI reflects new settings

**7.5 Form Validation**
- User enters invalid email format
- Validation error displayed
- Save button disabled
- User corrects email
- Save button enabled

**7.6 Reset to Defaults**
- User clicks "Reset to Defaults" button
- Confirmation dialog appears
- User confirms reset
- All settings reverted to defaults
- Success message displayed

**7.7 Settings Persistence**
- User updates multiple settings
- User logs out and back in
- Settings remain as last saved
- No data loss

#### Dependencies
- Authenticated user fixture
- Settings API endpoints
- Settings storage (database/user preferences)

#### Success Criteria
- All settings functional
- Validation prevents invalid input
- Changes persist across sessions
- Reset functionality works correctly

---

### Phase 8: Newsletter/Leads
**Priority:** Medium
**Estimated Effort:** 2 days
**File:** Enhancement to `src/test/e2e/landing-extended.spec.ts`

#### Test Scenarios (Unskip Existing)

**8.1 Newsletter Submission**
```typescript
test('should submit newsletter form and show success message', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.getByPlaceholder(/email/i).first();
  await emailInput.fill('test@example.com');

  const submitButton = page.locator('form').first().getByRole('button').first();
  await submitButton.click();

  // Wait for API call
  const apiResponse = await page.waitForResponse(
    resp => resp.url().includes('/api/leads') && resp.status() === 200,
    { timeout: 5000 }
  );
  expect(apiResponse.ok()).toBeTruthy();

  // Verify success message
  await expect(page.getByText(/thank you|success|subscribed/i)).toBeVisible({ timeout: 5000 });
});
```

**8.2 Error Handling**
```typescript
test('should handle newsletter signup errors gracefully', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Mock API to return error
  await page.route('/api/leads', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    });
  });

  const emailInput = page.getByPlaceholder(/email/i).first();
  await emailInput.fill('test@example.com');

  const submitButton = page.locator('form').first().getByRole('button').first();
  await submitButton.click();

  // Should show error message
  await expect(page.getByText(/error|try again/i)).toBeVisible({ timeout: 5000 });
});
```

**8.3 Duplicate Prevention**
```typescript
test('should prevent duplicate newsletter signups', async ({ page }) => {
  await page.goto('/');

  const emailInput = page.getByPlaceholder(/email/i).first();
  await emailInput.fill('existing@example.com');

  const submitButton = page.locator('form').first().getByRole('button').first();
  await submitButton.click();

  // API should return error for duplicate
  const apiResponse = await page.waitForResponse(
    resp => resp.url().includes('/api/leads'),
    { timeout: 5000 }
  );

  expect(apiResponse.status()).toBe(409); // Conflict
  await expect(page.getByText(/already subscribed/i)).toBeVisible({ timeout: 5000 });
});
```

#### Dependencies
- `/api/leads` endpoint implementation
- Resend email service integration
- Database for lead storage
- Duplicate detection logic

#### Success Criteria
- Newsletter submission functional
- Error messages clear and actionable
- Duplicate prevention working
- Email sent to user (verify in test inbox)

---

### Phase 9: Payment Integration
**Priority:** Medium
**Estimated Effort:** 4-5 days
**File:** Enhancement to `src/test/e2e/payment-flow.spec.ts`

#### Test Scenarios (Unskip Existing)

**9.1 Checkout Initiation**
```typescript
test('should initiate checkout session when CTA clicked', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
  await ctaButton.click();

  // Wait for checkout API call
  const checkoutResponse = await page.waitForResponse(
    resp => resp.url().includes('/api/checkout'),
    { timeout: 10000 }
  );

  expect(checkoutResponse.ok()).toBeTruthy();

  const data = await checkoutResponse.json();
  expect(data.sessionId).toBeTruthy();
});
```

**9.2 Stripe Redirect**
```typescript
test('should redirect to Stripe checkout page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
  await ctaButton.click();

  // Wait for redirect to Stripe
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });

  expect(page.url()).toContain('checkout.stripe.com');
});
```

**9.3 Test Payment Completion**
```typescript
test('should complete test payment with test card', async ({ page }) => {
  await page.goto('/');
  const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
  await ctaButton.click();

  // Wait for Stripe checkout page
  await page.waitForURL(/checkout\.stripe\.com/);

  // Fill test card details (Stripe test mode)
  await page.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM / YY').fill('12/34');
  await page.getByPlaceholder('CVC').fill('123');
  await page.getByPlaceholder('ZIP').fill('12345');

  // Fill email if required
  const emailField = page.getByPlaceholder('Email');
  if (await emailField.isVisible()) {
    await emailField.fill('test@example.com');
  }

  // Submit payment
  await page.getByRole('button', { name: /pay|subscribe/i }).click();

  // Redirects back to success page
  await page.waitForURL(/\/checkout\/success|\/thank-you/, { timeout: 30000 });

  // Verify success message
  await expect(page.getByText(/thank you|success|confirmed/i)).toBeVisible();
});
```

**9.4 Payment Cancellation**
```typescript
test('should handle payment cancellation', async ({ page }) => {
  await page.goto('/');
  const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
  await ctaButton.click();

  // Wait for Stripe checkout page
  await page.waitForURL(/checkout\.stripe\.com/);

  // Click back/cancel button
  await page.goBack();

  // Should return to original page
  await expect(page).toHaveURL(/\//);
});
```

**9.5 Webhook Subscription Activation**
```typescript
test('webhook should activate member access after payment', async ({ page }) => {
  // Complete payment flow
  // (use helper function from 9.3)

  // Navigate to member portal
  await page.goto('/app');

  // Verify access granted (not redirected to auth)
  await expect(page).toHaveURL(/\/app/);

  // Check subscription status in profile
  await page.goto('/app/profile');
  const subscriptionStatus = page.getByText(/active|subscribed/i);
  await expect(subscriptionStatus).toBeVisible();
});
```

#### Dependencies
- Stripe test mode configuration
- `/api/checkout` endpoint
- `/api/stripe/webhook` handler
- Success/cancel pages
- Webhook testing infrastructure (Stripe CLI or mock)

#### Success Criteria
- Complete payment flow functional
- Webhook activates membership
- Subscription status accurate
- Test mode prevents real charges

---

### Phase 10: Offers Pages
**Priority:** Low
**Estimated Effort:** 1-2 days
**File:** `src/test/e2e/offers.spec.ts`

#### Test Scenarios

**10.1 Diamond Advantage Page**
- User navigates to `/offers/diamond-advantage`
- Page loads successfully
- Hero section visible
- Features/benefits listed
- CTA button visible
- Clicking CTA initiates checkout

**10.2 Pressure Room One Page**
- User navigates to `/offers/pressure-room-one`
- Page renders correctly
- Course details displayed
- Pricing information visible
- Enrollment CTA functional

**10.3 Diamond Edge Mastery Page**
- User navigates to `/offers/diamond-edge-mastery`
- Page content loads
- Program overview visible
- Testimonials displayed (if applicable)
- Sign-up flow works

**10.4 Responsive Design**
- All offer pages tested on mobile (375x667)
- All offer pages tested on tablet (768x1024)
- All offer pages tested on desktop (1280x720)
- Layouts adapt appropriately
- No content overflow

**10.5 CTA Functionality**
- Each offer page CTA leads to correct checkout
- Product ID matches offer
- Pricing displays correctly
- Stripe session created with correct product

#### Dependencies
- Offer page content
- Stripe product IDs for each offer
- Checkout integration

#### Success Criteria
- All offer pages accessible
- CTAs functional
- Responsive across devices
- Checkout integration correct

---

### Phase 11: Blog & Collective
**Priority:** Low
**Estimated Effort:** 1-2 days
**File:** `src/test/e2e/content-pages.spec.ts`

#### Test Scenarios

**11.1 Blog Listing Page**
- User navigates to `/blog`
- Blog posts listed
- Post thumbnails visible
- Post titles and excerpts displayed
- Published dates shown
- Pagination functional (if applicable)

**11.2 Blog Post Reading**
- User clicks on blog post
- Navigates to `/blog/[slug]`
- Full post content rendered
- Markdown formatting applied
- Images displayed
- Back to blog link functional

**11.3 Collective Page**
- User navigates to `/collective`
- Page loads successfully
- Content renders correctly
- Links functional
- Images/media display

**11.4 Content Search/Filter (if implemented)**
- User enters search term
- Blog posts filtered
- Results relevant to search
- Clear search resets filter

#### Dependencies
- Blog content (markdown files)
- Collective page content
- Content API endpoints

#### Success Criteria
- Content renders correctly
- Navigation functional
- Markdown formatting validated
- Images optimized and displayed

---

### Phase 12: CMS/OAuth
**Priority:** Low
**Estimated Effort:** 3-4 days
**File:** Enhancement to `src/test/e2e/oauth-flow.spec.ts`

#### Test Scenarios (Unskip Existing)

**12.1 GitHub OAuth Initiation**
```typescript
test('should initiate GitHub OAuth flow on login', async ({ page, context }) => {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle', { timeout: 15000 });

  const loginButton = page.getByRole('button', { name: /login.*github|github.*login/i });

  if (await loginButton.isVisible()) {
    // Click login and expect popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      loginButton.click()
    ]);

    await popup.waitForLoadState();

    // Verify OAuth endpoint
    expect(popup.url()).toMatch(/\/api\/auth|github\.com\/login\/oauth/);

    await popup.close();
  }
});
```

**12.2 OAuth Callback Handling**
```typescript
test('should handle OAuth callback', async ({ page }) => {
  // Navigate to callback with test code
  await page.goto('/api/callback?code=test_auth_code&state=test_state');

  // Callback should return HTML with postMessage script
  const content = await page.content();

  expect(content).toContain('postMessage');
  expect(content).toContain('authorization:github:success');
});
```

**12.3 Complete OAuth Flow**
```typescript
test('should complete OAuth and show CMS interface', async ({ page, context }) => {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');

  const loginButton = page.getByRole('button', { name: /login.*github/i });

  if (await loginButton.isVisible()) {
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      loginButton.click()
    ]);

    // Mock OAuth callback
    await popup.goto('/api/callback?code=mock_code&state=mock_state');

    // Wait for parent to receive auth
    await page.waitForTimeout(2000);

    // CMS authenticated interface
    const contentButton = page.getByRole('button', { name: /new|create/i });
    await expect(contentButton).toBeVisible({ timeout: 10000 });
  }
});
```

**12.4 Content Creation**
```typescript
test('authenticated user can create new content', async ({ page }) => {
  // Load auth state
  await page.goto('/admin');

  // Navigate to collections
  await page.getByText(/news|blog/i).first().click();

  // Click new entry
  await page.getByRole('button', { name: /new|create/i }).click();

  // Fill content
  await page.getByLabel(/title/i).fill('Test Article');
  await page.getByLabel(/description/i).fill('Test description');

  // Save draft
  await page.getByRole('button', { name: /save|publish/i }).click();

  // Verify success
  await expect(page.getByText(/saved|published/i)).toBeVisible({ timeout: 5000 });
});
```

**12.5 Content Editing**
```typescript
test('authenticated user can edit existing content', async ({ page }) => {
  await page.goto('/admin');

  // Navigate to collection
  await page.getByText(/news|blog/i).first().click();

  // Click first entry
  await page.locator('.cms-card, .entry-card').first().click();

  // Edit title
  const titleField = page.getByLabel(/title/i);
  await titleField.clear();
  await titleField.fill('Updated Title');

  // Save
  await page.getByRole('button', { name: /save|publish/i }).click();

  await expect(page.getByText(/saved|updated/i)).toBeVisible({ timeout: 5000 });
});
```

#### Dependencies
- GitHub OAuth test app
- CMS test environment
- Auth state fixture
- Test content repository

#### Success Criteria
- OAuth flow completes successfully
- CMS interface accessible after auth
- Content CRUD operations functional
- Changes commit to GitHub

---

## Test Infrastructure Requirements

### Authentication Fixtures

**File:** `src/test/fixtures/auth.json`
```json
{
  "cookies": [
    {
      "name": "next-auth.session-token",
      "value": "test-session-token",
      "domain": "localhost",
      "path": "/",
      "httpOnly": true,
      "secure": false
    }
  ]
}
```

**Generator Script:** `src/test/utils/generate-auth-fixture.ts`
```typescript
import { chromium } from '@playwright/test';

async function generateAuthFixture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Sign in
  await page.goto('http://localhost:3003/auth/signin');
  await page.getByPlaceholder('Email').fill('test@example.com');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for magic link email (manual step or automated with email service)
  // ... click magic link ...

  // Save storage state
  await context.storageState({ path: 'src/test/fixtures/auth.json' });

  await browser.close();
}

generateAuthFixture();
```

### Test Data

**Course Content:** `src/test/fixtures/test-course.json`
```json
{
  "courseId": "test-course-1",
  "title": "Test Course",
  "slides": [
    {
      "id": 1,
      "title": "Introduction",
      "content": "Test content",
      "videoId": "test-video-1"
    }
  ]
}
```

**Sprint Data:** `src/test/fixtures/test-sprint.json`
```json
{
  "sprintId": "30-day-challenge",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1: Foundation",
      "activities": [
        { "id": "activity-1", "title": "Watch video", "type": "video" },
        { "id": "activity-2", "title": "Complete exercise", "type": "exercise" }
      ]
    }
  ]
}
```

### Environment Variables

**File:** `.env.test`
```bash
# Test User
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test-password

# Stripe Test Mode
STRIPE_TEST_MODE=true
STRIPE_TEST_KEY=sk_test_xxx
STRIPE_TEST_PRODUCT_ID=prod_test_xxx

# Bunny Stream Test
BUNNY_TEST_LIBRARY=test-library-id
BUNNY_TEST_API_KEY=test-api-key

# Email Testing
MAILOSAUR_API_KEY=your-mailosaur-key
MAILOSAUR_SERVER_ID=your-server-id

# GitHub OAuth Test App
GITHUB_TEST_CLIENT_ID=test-client-id
GITHUB_TEST_CLIENT_SECRET=test-client-secret
```

### Mocking Strategy

**API Route Mocking:**
```typescript
// Mock external services in tests
await page.route('/api/chat', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ message: 'Mocked AI response' })
  });
});
```

**Video Player Mocking:**
```typescript
// Mock video for offline tests
await page.addInitScript(() => {
  HTMLMediaElement.prototype.play = async () => {};
  HTMLMediaElement.prototype.pause = () => {};
});
```

**Email Service Mocking:**
```typescript
// Use Mailosaur or MailHog for email testing
import { MailosaurClient } from 'mailosaur';
const client = new MailosaurClient(process.env.MAILOSAUR_API_KEY);
```

### Playwright Configuration Updates

**File:** `playwright.config.ts`
```typescript
export default defineConfig({
  projects: [
    {
      name: 'authenticated',
      use: {
        storageState: 'src/test/fixtures/auth.json'
      }
    },
    {
      name: 'unauthenticated',
      use: {}
    }
  ],

  webServer: {
    command: 'npm run dev',
    port: 3003,
    reuseExistingServer: !process.env.CI
  }
});
```

## Implementation Timeline

### Sequential Timeline (6 Weeks)

### Week 1: Foundation
- **Days 1-2:** Set up test infrastructure (fixtures, test data, env vars)
- **Days 3-5:** Phase 1 - Authentication flows (6 scenarios)

### Week 2: Core Features
- **Days 1-3:** Phase 2 - Sprint features (7 scenarios)
- **Days 4-5:** Phase 3 - Course interactions (7 scenarios)

### Week 3: Advanced Features
- **Days 1-2:** Phase 4 - Video playback (6 scenarios)
- **Days 3-5:** Phase 5 - Chat/AI (8 scenarios)

### Week 4: Secondary Features
- **Days 1-2:** Phase 6 - Profile management (6 scenarios)
- **Days 3-4:** Phase 7 - Settings (7 scenarios)
- **Day 5:** Phase 8 - Newsletter/leads (3 scenarios)

### Week 5: Integration & Content
- **Days 1-3:** Phase 9 - Payment integration (5 scenarios)
- **Days 4-5:** Phase 10 - Offers pages (5 scenarios)

### Week 6: CMS & Finalization
- **Days 1-2:** Phase 11 - Blog & Collective (4 scenarios)
- **Days 3-4:** Phase 12 - CMS/OAuth (5 scenarios)
- **Day 5:** Test suite optimization and documentation

---

## Parallel Development Strategy

### Overview

The implementation can be accelerated using parallel development with multiple agents working simultaneously on independent test phases. This reduces the total timeline from 6 weeks to approximately 5 weeks.

### Parallelization Analysis

#### ✅ High Parallelizability (Zero Dependencies)
- **Phase 6 + Phase 7 + Phase 10** - Profile, Settings, Offers (3 agents)
- **Phase 5 + Phase 11** - Chat/AI, Blog & Collective (2 agents)
- **Phase 8 + Phase 9** - Newsletter, Payment (2 agents)

#### ⚠️ Medium Parallelizability (Shared Auth Fixtures)
- **Phase 2 + Phase 3** - Sprint, Course Interactions (2 agents after Phase 1)

#### ❌ Must Be Sequential
- **Phase 1** - Authentication (blocks all authenticated tests)
- **Phase 4** - Video Playback (depends on Phase 3)

### Wave-Based Implementation

#### **Wave 1: Foundation (Sequential)**
**Duration:** 4 days | **Agents:** 1

```
┌─────────────────────────────────────┐
│ Agent: Infrastructure Specialist    │
├─────────────────────────────────────┤
│ Phase 1: Authentication Flows       │
│ - Create auth fixtures              │
│ - Email testing infrastructure      │
│ - 6 authentication scenarios        │
│                                     │
│ Output:                             │
│ - src/test/fixtures/auth.json       │
│ - src/test/e2e/auth-flow.spec.ts    │
│ - src/test/utils/auth-helpers.ts    │
└─────────────────────────────────────┘

Deliverables:
✓ Authentication fixtures for all subsequent phases
✓ Test infrastructure setup
✓ Auth helper utilities
✓ Email testing framework

Blocking: All authenticated test phases
```

#### **Wave 2: Core Features (Parallel)**
**Duration:** 5 days | **Agents:** 2

```
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ Agent A: Sprint Specialist       │  │ Agent B: Course Specialist       │
├──────────────────────────────────┤  ├──────────────────────────────────┤
│ Phase 2: Sprint Features         │  │ Phase 3: Course Interactions     │
│ - Sprint dashboard tests         │  │ - Slide navigation tests         │
│ - Daily challenge tests          │  │ - Completion tracking tests      │
│ - Activity completion tests      │  │ - Progress persistence tests     │
│ - 7 scenarios                    │  │ - 7 scenarios                    │
│                                  │  │                                  │
│ Output:                          │  │ Output:                          │
│ - src/test/e2e/sprint.spec.ts    │  │ - src/test/e2e/course-           │
│ - src/test/fixtures/sprint.json  │  │   interactions.spec.ts           │
└──────────────────────────────────┘  └──────────────────────────────────┘

Dependencies: Wave 1 auth fixtures
Overlap: Minimal (different features)
Risk: Low
Coordination: Weekly sync on auth fixture usage
```

#### **Wave 3: Secondary Features (Parallel)**
**Duration:** 4 days | **Agents:** 4

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Agent A:            │  │ Agent B:            │  │ Agent C:            │  │ Agent D:            │
│ Chat Specialist     │  │ Profile Specialist  │  │ Settings Specialist │  │ Offers Specialist   │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ Phase 5:            │  │ Phase 6:            │  │ Phase 7:            │  │ Phase 10:           │
│ Chat/DiamondMindAI  │  │ Profile Management  │  │ Settings            │  │ Offers Pages        │
│                     │  │                     │  │                     │  │                     │
│ - Interface tests   │  │ - Display tests     │  │ - Navigation tests  │  │ - Diamond Advantage │
│ - Message sending   │  │ - Editing tests     │  │ - Preference tests  │  │ - Pressure Room One │
│ - AI responses      │  │ - Avatar upload     │  │ - Persistence tests │  │ - Edge Mastery      │
│ - History tests     │  │ - Stats display     │  │ - Form validation   │  │ - Responsive tests  │
│ - 8 scenarios       │  │ - 6 scenarios       │  │ - 7 scenarios       │  │ - 5 scenarios       │
│                     │  │                     │  │                     │  │                     │
│ Output:             │  │ Output:             │  │ Output:             │  │ Output:             │
│ - chat-interaction  │  │ - profile.spec.ts   │  │ - settings.spec.ts  │  │ - offers.spec.ts    │
│   .spec.ts          │  │ - profile.json      │  │ - settings.json     │  │ - offers.json       │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘

Dependencies: Wave 1 auth fixtures
Overlap: None (completely independent features)
Risk: Very Low
Coordination: Daily standup for blocker identification

Branch Strategy:
- feature/e2e-chat-tests
- feature/e2e-profile-tests
- feature/e2e-settings-tests
- feature/e2e-offers-tests
```

#### **Wave 4: Integrations (Parallel)**
**Duration:** 5 days | **Agents:** 2

```
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ Agent A: Newsletter Specialist   │  │ Agent B: Payment Specialist      │
├──────────────────────────────────┤  ├──────────────────────────────────┤
│ Phase 8: Newsletter/Leads        │  │ Phase 9: Payment Integration     │
│ - Unskip existing tests          │  │ - Unskip existing tests          │
│ - Form submission tests          │  │ - Checkout flow tests            │
│ - Error handling tests           │  │ - Stripe redirect tests          │
│ - Duplicate prevention           │  │ - Payment completion tests       │
│ - 3 scenarios                    │  │ - Webhook tests                  │
│                                  │  │ - 5 scenarios                    │
│ Output:                          │  │                                  │
│ - Enhanced landing-extended      │  │ Output:                          │
│   .spec.ts                       │  │ - Enhanced payment-flow.spec.ts  │
└──────────────────────────────────┘  └──────────────────────────────────┘

Dependencies: None (public features)
Overlap: None
Risk: Low
Coordination: API endpoint implementation status sync

Note: Both modify existing test files (enhancements)
```

#### **Wave 5: Advanced Features (Parallel)**
**Duration:** 4 days | **Agents:** 2

```
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ Agent A: Video Specialist        │  │ Agent B: Content Specialist      │
├──────────────────────────────────┤  ├──────────────────────────────────┤
│ Phase 4: Video Playback          │  │ Phase 11: Blog & Collective      │
│ - Unskip existing tests          │  │ - Blog listing tests             │
│ - Player rendering tests         │  │ - Blog post tests                │
│ - Token API tests                │  │ - Collective page tests          │
│ - Playback controls              │  │ - Content rendering tests        │
│ - Progress tracking              │  │ - 4 scenarios                    │
│ - 6 scenarios                    │  │                                  │
│                                  │  │ Output:                          │
│ Output:                          │  │ - content-pages.spec.ts          │
│ - Enhanced course-playback       │  │ - blog.json                      │
│   .spec.ts                       │  │                                  │
└──────────────────────────────────┘  └──────────────────────────────────┘

Dependencies: Phase 3 (for Phase 4)
Overlap: None
Risk: Medium (Phase 4 technical complexity)
Coordination: Video API implementation status check
```

#### **Wave 6: CMS (Optional)**
**Duration:** 4 days | **Agents:** 1

```
┌─────────────────────────────────────┐
│ Agent: CMS Specialist               │
├─────────────────────────────────────┤
│ Phase 12: CMS/OAuth                 │
│ - Unskip existing tests             │
│ - OAuth flow tests                  │
│ - Content creation tests            │
│ - Content editing tests             │
│ - 5 scenarios                       │
│                                     │
│ Output:                             │
│ - Enhanced oauth-flow.spec.ts       │
│ - cms-auth.json                     │
└─────────────────────────────────────┘

Dependencies: None (low priority)
Risk: Medium (OAuth complexity)
Note: Can be deferred if timeline pressure
```

### Parallel Timeline Summary

```
Week 1
├─ Days 1-4: Wave 1 (1 agent)
└─ Day 5: Wave 2 begins

Week 2
└─ Days 1-5: Wave 2 continues (2 agents)

Week 3
└─ Days 1-4: Wave 3 (4 agents - PEAK PARALLELIZATION)
   Day 5: Wave 4 begins

Week 4
├─ Days 1-5: Wave 4 (2 agents)
└─ Wave 5 begins overlap

Week 5
├─ Days 1-4: Wave 5 (2 agents)
└─ Days 5: Wave 6 (1 agent) or optimization

Total Duration: ~5 weeks
Peak Agents: 4 simultaneous
Efficiency Gain: ~17% faster than sequential
```

### Agent Coordination

#### **Shared Resources**

**1. Authentication Fixtures** (Read-Only After Wave 1)
```
src/test/fixtures/auth.json
├─ Created by: Wave 1
├─ Used by: Waves 2-6
└─ Conflict Risk: None (read-only)
```

**2. Test Data Files** (Namespaced by Feature)
```
src/test/fixtures/
├─ sprint.json        (Wave 2 - Agent A)
├─ course.json        (Wave 2 - Agent B)
├─ chat.json          (Wave 3 - Agent A)
├─ profile.json       (Wave 3 - Agent B)
├─ settings.json      (Wave 3 - Agent C)
├─ offers.json        (Wave 3 - Agent D)
└─ blog.json          (Wave 5 - Agent B)

Conflict Risk: Low (separate files)
```

**3. Playwright Configuration**
```
playwright.config.ts
├─ Projects config
├─ Test timeout settings
└─ Browser configurations

Coordination: PR review before merge
Conflict Risk: Medium (shared file)
Strategy: Last merge wins, coordinate via PR comments
```

**4. Environment Variables**
```
.env.test
├─ Namespaced by feature (SPRINT_*, CHAT_*, etc.)
├─ Coordinated additions only
└─ No overwrites

Conflict Risk: Medium
Strategy: Document variable ownership in PR
```

#### **Conflict Mitigation**

**Branch Strategy:**
```bash
# Wave 2
feature/e2e-sprint-tests        (Agent A)
feature/e2e-course-tests        (Agent B)

# Wave 3
feature/e2e-chat-tests          (Agent A)
feature/e2e-profile-tests       (Agent B)
feature/e2e-settings-tests      (Agent C)
feature/e2e-offers-tests        (Agent D)

# Wave 4
feature/e2e-newsletter-tests    (Agent A)
feature/e2e-payment-tests       (Agent B)

# Wave 5
feature/e2e-video-tests         (Agent A)
feature/e2e-content-tests       (Agent B)

# Wave 6
feature/e2e-cms-tests           (Agent)
```

**Merge Protocol:**
1. Agent completes phase implementation
2. Runs full test suite locally
3. Creates PR with phase tag (e.g., `[Phase 2]`)
4. CI runs E2E tests in isolation
5. Code review (focus on test quality)
6. Merge to main
7. Notify other agents of merge

**Daily Coordination:**
- 15-minute standup (async via Slack/GitHub)
- Share blockers and dependencies
- Coordinate playwright.config.ts changes
- Review shared fixture modifications

#### **Quality Gates**

Each wave must pass before next wave begins:

**Wave 1 Exit Criteria:**
- ✓ Auth fixtures generated
- ✓ Email testing framework operational
- ✓ All 6 auth scenarios passing
- ✓ Auth helpers documented

**Wave 2 Exit Criteria:**
- ✓ Sprint tests passing (7 scenarios)
- ✓ Course tests passing (7 scenarios)
- ✓ No auth fixture regressions
- ✓ Cross-browser validation complete

**Wave 3 Exit Criteria:**
- ✓ All 4 agents' tests passing (26 scenarios)
- ✓ No merge conflicts
- ✓ Performance benchmarks met (<30s per test)
- ✓ Mobile responsiveness validated

**Wave 4 Exit Criteria:**
- ✓ Newsletter tests passing (3 scenarios)
- ✓ Payment tests passing (5 scenarios)
- ✓ API integrations validated
- ✓ Webhook handling confirmed

**Wave 5 Exit Criteria:**
- ✓ Video tests passing (6 scenarios)
- ✓ Content tests passing (4 scenarios)
- ✓ Video playback validated across browsers
- ✓ Content rendering accurate

### Resource Allocation

#### **Optimal Agent Distribution**

**Wave 1 (Critical Path):**
- 1 senior engineer (authentication expertise)
- Full-time focus
- No distractions

**Wave 2 (Parallel Core):**
- 2 mid-level engineers
- Domain knowledge: Sprint features, Course architecture
- 50% time allocation each

**Wave 3 (Maximum Parallelization):**
- 4 engineers (mix of senior/mid-level)
- Specialized assignments
- 100% time allocation
- High coordination overhead acceptable

**Wave 4 (Integration Focus):**
- 2 senior engineers
- API integration experience
- Stripe/Resend familiarity preferred

**Wave 5 (Technical Complexity):**
- 2 engineers
- Video specialist (HLS.js, Bunny Stream)
- Content specialist (SSG, markdown)

**Wave 6 (Optional):**
- 1 engineer (can be deferred)
- OAuth/GitHub expertise

#### **Total Effort**

**Sequential Approach:**
- 6 weeks × 1 engineer = 6 engineer-weeks

**Parallel Approach:**
- Wave 1: 4 days × 1 engineer = 0.8 engineer-weeks
- Wave 2: 5 days × 2 engineers = 2.0 engineer-weeks
- Wave 3: 4 days × 4 engineers = 3.2 engineer-weeks
- Wave 4: 5 days × 2 engineers = 2.0 engineer-weeks
- Wave 5: 4 days × 2 engineers = 1.6 engineer-weeks
- Wave 6: 4 days × 1 engineer = 0.8 engineer-weeks

**Total: 10.4 engineer-weeks** (vs 6 sequential)
**Timeline Reduction: 17%** (6 weeks → 5 weeks)
**Trade-off:** Higher coordination overhead, more resources

### Recommendations

**Best for Small Teams (1-2 engineers):**
- Use sequential timeline
- Focus on critical path phases first
- Defer low-priority phases (CMS, Blog)

**Best for Medium Teams (3-4 engineers):**
- Implement Waves 2-3 in parallel
- Sequential for Waves 1, 4-6
- Timeline: ~5 weeks

**Best for Large Teams (5+ engineers):**
- Full wave-based parallel execution
- Dedicated coordination role
- Timeline: ~4-5 weeks
- Highest efficiency but requires strong coordination

## Success Metrics

### Coverage Goals
- **Total Scenarios:** 90+ E2E test scenarios
- **Critical Path Coverage:** 100% (auth, payment, core features)
- **User Workflow Coverage:** 95%
- **Browser Coverage:** Chrome, Firefox, Safari (WebKit)
- **Device Coverage:** Desktop, tablet, mobile viewports

### Performance Targets
- **Average Test Duration:** < 30 seconds per scenario
- **Full Suite Runtime:** < 20 minutes
- **Flakiness Rate:** < 2%
- **Pass Rate:** > 98%

### Quality Standards
- All tests independent (no shared state)
- Clear, descriptive test names
- Comprehensive assertions
- Proper error messages
- Retry logic for network-dependent tests
- Cleanup after each test

## Maintenance Plan

### Test Review Cadence
- **Weekly:** Review failed tests, update fixtures
- **Sprint End:** Add tests for new features
- **Monthly:** Performance audit, remove obsolete tests
- **Quarterly:** Full test suite refactoring review

### Documentation Updates
- Keep this spec updated with implementation progress
- Document test data requirements
- Maintain troubleshooting guide
- Update environment setup instructions

### Continuous Improvement
- Monitor test execution times
- Identify and fix flaky tests
- Refactor duplicate test code
- Add visual regression tests
- Implement parallel test execution

## Risk Mitigation

### Identified Risks

**1. External Service Dependencies**
- **Risk:** Stripe, Bunny Stream, email services may be unreliable
- **Mitigation:** Mock external services, use test modes, implement retry logic

**2. Test Data Management**
- **Risk:** Test data conflicts, outdated fixtures
- **Mitigation:** Isolated test databases, data cleanup scripts, version-controlled fixtures

**3. Authentication Complexity**
- **Risk:** Magic link auth difficult to automate
- **Mitigation:** Email testing service (Mailosaur), auth fixture generation

**4. Video Playback Testing**
- **Risk:** Video playback inconsistent across browsers
- **Mitigation:** Mock video for offline tests, use lightweight test videos

**5. Test Flakiness**
- **Risk:** Timing issues, race conditions
- **Mitigation:** Explicit waits, retry logic, stable selectors

## Appendix

### Test Naming Conventions
```typescript
// Good
test('authenticated user can complete sprint day 1 activities', ...)

// Bad
test('sprint test', ...)
```

### Assertion Patterns
```typescript
// Explicit timeouts
await expect(element).toBeVisible({ timeout: 5000 });

// Multiple assertions
await expect(page).toHaveURL(/\/app/);
await expect(heading).toContainText('Dashboard');

// Custom matchers
await expect(progress).toBeCloseTo(0.5, 1);
```

### Page Object Model (Optional)
```typescript
// src/test/page-objects/CoursePage.ts
export class CoursePage {
  constructor(private page: Page) {}

  async navigateToSlide(slideNumber: number) {
    await this.page.getByRole('button', { name: `Slide ${slideNumber}` }).click();
  }

  async markSlideComplete() {
    await this.page.getByRole('button', { name: /complete/i }).click();
  }
}
```

### Debugging Tips
```bash
# Run single test
npx playwright test auth-flow.spec.ts -g "magic link sign-in"

# Debug mode
npx playwright test --debug

# Show browser
npx playwright test --headed

# Generate test report
npx playwright show-report
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-04
**Status:** Draft
**Owner:** Development Team
