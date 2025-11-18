# Sprint E2E Testing Guide

Quick reference for running and maintaining Sprint E2E tests.

## Quick Start

### Prerequisites
```bash
# Ensure dev server is running
npm run dev

# In another terminal, run tests
npx playwright test src/test/e2e/sprint.spec.ts
```

### Common Commands

**Run all Sprint tests:**
```bash
npx playwright test src/test/e2e/sprint.spec.ts
```

**Run with UI mode (interactive):**
```bash
npx playwright test src/test/e2e/sprint.spec.ts --ui
```

**Run in headed mode (see browser):**
```bash
npx playwright test src/test/e2e/sprint.spec.ts --headed
```

**Run specific test by name:**
```bash
npx playwright test src/test/e2e/sprint.spec.ts -g "displays dashboard"
```

**Run with debug mode:**
```bash
npx playwright test src/test/e2e/sprint.spec.ts --debug
```

**Generate HTML report:**
```bash
npx playwright test src/test/e2e/sprint.spec.ts --reporter=html
npx playwright show-report
```

## Test Structure

### Test Scenarios (36 tests total)

1. **Sprint Dashboard Overview** (5 tests)
   - Not started state
   - In-progress state
   - Completed state
   - Quick links
   - Statistics

2. **Daily Challenge Navigation** (5 tests)
   - Navigation from dashboard
   - Day content display
   - Activity order
   - Progress indicators
   - Navigation arrows

3. **Activity Completion** (6 tests)
   - Mark complete functionality
   - Persistence on reload
   - Next day unlock
   - Real-time updates
   - Sequential access control

4. **Sprint Watch Page** (5 tests)
   - Navigation to watch page
   - Video player display
   - Playlist sidebar
   - Completion indicators
   - Video metadata

5. **Sprint Progress Dashboard** (5 tests)
   - 30-day grid display
   - Completed day markers
   - Current day highlight
   - Statistics summary
   - Reset button

6. **Day-to-Day Progression** (4 tests)
   - Day completion and unlock
   - Sequential navigation
   - Backward navigation
   - Dashboard updates

7. **Mobile Responsiveness** (6 tests)
   - Dashboard on mobile (375x667)
   - Day content on mobile
   - Grid layout on mobile
   - Watch page on mobile
   - Touch interactions
   - Mobile navigation

## Test Fixtures

### Sprint Progress States

Located in: `/src/test/fixtures/sprint.json`

**Available states:**
- `notStarted` - New user, no days completed
- `inProgress` - Days 1-4 completed, currently on Day 5
- `completed` - All 30 days completed

**Usage in tests:**
```typescript
await setSprintProgress(page, 'notStarted');
await setSprintProgress(page, 'inProgress');
await setSprintProgress(page, 'completed');
```

## Debugging Failed Tests

### Step 1: Check Dev Server
```bash
# Ensure server is running on port 3003
lsof -i :3003
```

### Step 2: Run in Headed Mode
```bash
npx playwright test src/test/e2e/sprint.spec.ts --headed --debug
```

### Step 3: Check Screenshots
Failed tests automatically capture screenshots in:
```
test-results/sprint-[test-name]/test-failed-1.png
```

### Step 4: Review Video Recording
Failed tests also record video:
```
test-results/sprint-[test-name]/video.webm
```

### Step 5: Check Browser Console
```bash
# Run with console output
npx playwright test src/test/e2e/sprint.spec.ts --headed
```

## Common Issues

### Issue: Tests timeout waiting for elements

**Solution:**
```typescript
// Increase timeout in test
await expect(element).toBeVisible({ timeout: 10000 });

// Or globally in playwright.config.ts
use: {
  timeout: 30000
}
```

### Issue: Tests fail with "ERR_CONNECTION_REFUSED"

**Solution:**
- Start dev server: `npm run dev`
- Check port 3003 is available
- Verify `baseURL` in playwright.config.ts

### Issue: localStorage state not persisting

**Solution:**
```typescript
// Ensure init script runs before navigation
await setSprintProgress(page, 'inProgress');
await page.goto('/app/sprint'); // State set before goto
```

### Issue: Mobile tests failing

**Solution:**
```typescript
// Set viewport before test
await page.setViewportSize({ width: 375, height: 667 });
```

## Updating Tests

### When Sprint Content Changes

**Day structure changes:**
Update selectors in `/src/test/e2e/sprint.spec.ts`

**Day count changes:**
Update fixtures in `/src/test/fixtures/sprint.json`

**Video IDs change:**
Update video references in fixtures

### When UI Changes

**Button text changes:**
Update role-based selectors:
```typescript
// Before
page.getByRole('button', { name: /Mark Complete/i })

// After (if text changes)
page.getByRole('button', { name: /Complete Day/i })
```

**Layout changes:**
Update structural selectors in tests

### When State Management Changes

**localStorage to database:**
Replace helper functions:
```typescript
// Before (localStorage)
await setSprintProgress(page, 'inProgress');

// After (database)
await createSprintProgress(userId, { currentDay: 5 });
```

## Best Practices

### 1. Independent Tests
Each test should:
- Set its own state
- Not depend on other tests
- Clean up after itself

### 2. Explicit Waits
Always wait for:
- Page load: `waitForLoadState('domcontentloaded')`
- Element visibility: `expect(element).toBeVisible()`
- Navigation: `waitForURL()`

### 3. Flexible Selectors
Prefer:
- Role-based: `getByRole('button', { name: /text/i })`
- Text content: `getByText(/pattern/i)`
- Test IDs (if added): `getByTestId('sprint-dashboard')`

Avoid:
- CSS classes: `.class-name`
- Complex XPath: `//div[@class='...']`

### 4. Test Naming
Use descriptive names:
```typescript
// Good
test('completes day 5 and unlocks day 6', async ({ page }) => {

// Bad
test('test 1', async ({ page }) => {
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run dev &
      - run: npx playwright test src/test/e2e/sprint.spec.ts
```

## Performance

### Test Execution Time
- Full suite: ~2-3 minutes
- Single test: ~3-5 seconds
- Parallel workers: 8 (default)

### Optimization Tips
1. Run in parallel (default)
2. Use `--shard` for distributed testing
3. Skip slow tests in development
4. Use `--grep` to run specific tests

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Patterns](https://playwright.dev/docs/test-use-options)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Support

For issues or questions:
1. Check test output and screenshots
2. Review this guide
3. Run tests in debug mode
4. Check Playwright documentation
5. Contact development team
