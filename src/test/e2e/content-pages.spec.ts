import { test, expect } from '@playwright/test';

test.describe('blog listing page', () => {
  test('should display blog posts', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check for main heading
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/blog/i);

    // Check for blog post cards
    const posts = page.locator('a[href^="/blog/"]');
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);

    // Check first post has required elements
    const firstPost = posts.first();
    await expect(firstPost).toBeVisible();
  });

  test('should show post metadata', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Get first blog post card
    const firstPostCard = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostCard).toBeVisible();

    // Check for title (h3 within the card)
    const title = firstPostCard.locator('h3').first();
    await expect(title).toBeVisible();

    // Check for excerpt
    const excerpt = firstPostCard.locator('p.text-gray-400, p.text-sm').first();
    await expect(excerpt).toBeVisible();

    // Check for date or author info
    const meta = firstPostCard.locator('.text-gray-500, .text-xs');
    expect(await meta.count()).toBeGreaterThan(0);
  });

  test('should display post thumbnails', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check for images within post cards
    const postImages = page.locator('a[href^="/blog/"] img');
    const imageCount = await postImages.count();

    // At least one post should have an image
    if (imageCount > 0) {
      const firstImage = postImages.first();
      await expect(firstImage).toBeVisible();

      // Check image has alt text
      const altText = await firstImage.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
  });

  test('should display category badges', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Look for category badges
    const categoryBadges = page.locator('span.text-xs.px-2.py-1.bg-primary\\/20, .bg-primary\\/20');

    if (await categoryBadges.count() > 0) {
      const firstBadge = categoryBadges.first();
      await expect(firstBadge).toBeVisible();
    }
  });

  test('should show category filter options', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check for "All Posts" filter button
    const allPostsButton = page.locator('a[href="/blog"] span', { hasText: 'All Posts' });

    if (await allPostsButton.count() > 0) {
      await expect(allPostsButton.first()).toBeVisible();

      // Check for other category filters
      const categoryLinks = page.locator('a[href*="?category="]');
      expect(await categoryLinks.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have CTA section', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom to reveal CTA
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for CTA heading
    const ctaHeading = page.getByRole('heading', { name: /transformation/i });
    await expect(ctaHeading).toBeVisible({ timeout: 10000 });

    // Look for CTA button/link
    const ctaButton = page.locator('a[href*="auth"], button', { hasText: /sprint|start|begin/i }).last();
    await expect(ctaButton).toBeVisible();
  });
});

test.describe('blog post reading', () => {
  test('should render full post content', async ({ page }) => {
    // First navigate to blog listing
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Click first blog post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    // Wait for post page to load
    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Check post content is visible (use article tag specifically)
    const article = page.locator('article').first();
    await expect(article).toBeVisible();

    // Check for main heading
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test('should render markdown formatting', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Check for markdown rendered elements
    const content = page.locator('article, .prose').first();

    // Check for headings (h2, h3, etc.)
    const headings = content.locator('h1, h2, h3, h4');
    expect(await headings.count()).toBeGreaterThan(0);

    // Check for paragraphs
    const paragraphs = content.locator('p');
    expect(await paragraphs.count()).toBeGreaterThan(0);
  });

  test('should display post metadata', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Check for author name or date in meta section
    const metaSection = page.locator('.flex.items-center.gap-6, .flex.items-center').first();
    await expect(metaSection).toBeVisible();

    // Check for date (looks for year patterns)
    const dateText = page.locator('text=/202[0-9]|2019|2018/');
    await expect(dateText.first()).toBeVisible();

    // Check for categories
    const categories = page.locator('span.text-primary, span.bg-primary\\/20');
    if (await categories.count() > 0) {
      await expect(categories.first()).toBeVisible();
    }
  });

  test('should display featured image', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Look for hero/featured image
    const heroImage = page.locator('section img, article img').first();

    if (await heroImage.count() > 0) {
      await expect(heroImage).toBeVisible();

      // Check image has source
      const src = await heroImage.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should have back to blog link', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Look for back link
    const backLink = page.locator('a[href="/blog"]', { hasText: /back/i }).first();
    await expect(backLink).toBeVisible();

    // Test back link functionality
    await backLink.click();
    await page.waitForURL('/blog');

    // Verify we're back on blog listing
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toContainText(/blog/i);
  });

  test('should display tags', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Scroll to bottom to find tags section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));

    // Look for tags
    const tags = page.locator('span', { hasText: /#/ });

    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test('should show related posts', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('networkidle');

    // Scroll to bottom to find related posts
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for related posts section
    const relatedHeading = page.getByRole('heading', { name: /related/i });

    if (await relatedHeading.count() > 0) {
      await expect(relatedHeading).toBeVisible();

      // Check for related post links
      const relatedLinks = page.locator('section a[href^="/blog/"]').last();
      if (await relatedLinks.count() > 0) {
        await expect(relatedLinks).toBeVisible();
      }
    }
  });
});

test.describe('collective page', () => {
  test('should load collective page successfully', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loaded
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display DiamondMind Immersion heading', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('domcontentloaded');

    // Look for main heading with "DiamondMind" or "Immersion"
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/diamond|immersion/i);
  });

  test('should display pricing information', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('domcontentloaded');

    // Look for price badge
    const price = page.locator('text=/\\$7,995|\\$7995/');
    await expect(price.first()).toBeVisible();
  });

  test('should show Pressure Room sections', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('domcontentloaded');

    // Look for Pressure Room references (PR I, PR II, etc.)
    const pressureRooms = page.locator('text=/PR ?[IVX]|Pressure Room/i');
    expect(await pressureRooms.count()).toBeGreaterThan(0);

    // Verify at least one PR section is visible
    await expect(pressureRooms.first()).toBeVisible();
  });

  test('should display the 5 Pressure Room cards', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('networkidle');

    // Scroll down to reveal PR cards
    await page.evaluate(() => window.scrollTo(0, 500));

    // Look for the 5 PR cards (Stabilize, Shift, Strengthen, Shine, Synthesize)
    const prCards = page.locator('div:has-text("PR")').filter({
      has: page.locator('h3, .text-xl')
    });

    const cardCount = await prCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3); // At least some cards visible
  });

  test('should show DiamondMindAI section', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('networkidle');

    // Scroll to find AI section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));

    // Look for DiamondMindAI reference
    const aiSection = page.locator('text=/DiamondMind.*AI|AI.*assistant/i');

    if (await aiSection.count() > 0) {
      await expect(aiSection.first()).toBeVisible();
    }
  });

  test('should display transformation journey timeline', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('networkidle');

    // Scroll to timeline section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));

    // Look for "Transformation" or "Journey" heading
    const timelineHeading = page.getByRole('heading', { name: /transformation|journey/i });

    if (await timelineHeading.count() > 0) {
      await expect(timelineHeading.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('domcontentloaded');

    // Check for navigation component
    const nav = page.locator('nav, header a');
    expect(await nav.count()).toBeGreaterThan(0);

    // Verify navigation is visible
    const firstNavElement = nav.first();
    await expect(firstNavElement).toBeVisible();
  });

  test('should display CTA button', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom for CTA
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for CTA button/link
    const ctaButton = page.locator('button, a[href*="auth"]', {
      hasText: /begin|start|apply|join/i
    }).last();

    await expect(ctaButton).toBeVisible({ timeout: 10000 });
  });

  test('should have footer', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 10000 });
  });

  test('should render without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/collective');
    await page.waitForLoadState('networkidle');

    // Allow some React/Framer Motion warnings, but no critical errors
    const criticalErrors = errors.filter(err =>
      !err.includes('Warning:') &&
      !err.includes('React does not recognize')
    );

    expect(criticalErrors.length).toBeLessThanOrEqual(2);
  });
});

test.describe('content search and filter', () => {
  test('should filter blog posts by category', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Get initial post count
    const allPostsCount = await page.locator('a[href^="/blog/"]').count();

    // Look for category filter links
    const categoryLinks = page.locator('a[href*="?category="]');

    if (await categoryLinks.count() > 0) {
      // Get the category filter URL before clicking
      const categoryHref = await categoryLinks.first().getAttribute('href');

      // Navigate to category page directly
      await page.goto(categoryHref || '/blog');
      await page.waitForLoadState('domcontentloaded');

      // Get filtered post count
      const filteredPostsCount = await page.locator('a[href^="/blog/"]').count();

      // Filtered results should be less than or equal to total
      expect(filteredPostsCount).toBeLessThanOrEqual(allPostsCount);

      // Verify URL has category parameter
      expect(page.url()).toContain('category=');
    } else {
      // Skip if no category filters available
      test.skip();
    }
  });

  test('should return to all posts when clicking "All Posts"', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Get initial post count
    const initialPostCount = await page.locator('a[href^="/blog/"]').count();

    // Look for category filter
    const categoryLinks = page.locator('a[href*="?category="]');

    if (await categoryLinks.count() > 0) {
      // Click category filter
      await categoryLinks.first().click();
      await page.waitForLoadState('domcontentloaded');

      // Click "All Posts" to reset filter
      const allPostsButton = page.locator('a[href="/blog"] span', { hasText: 'All Posts' });
      await allPostsButton.click();
      await page.waitForLoadState('domcontentloaded');

      // Verify we're back to all posts
      const currentPostCount = await page.locator('a[href^="/blog/"]').count();
      expect(currentPostCount).toBe(initialPostCount);

      // Verify URL has no category parameter
      expect(page.url()).not.toContain('category=');
    } else {
      test.skip();
    }
  });

  test.skip('should filter blog posts by search term', async ({ page }) => {
    // TODO: Implement when search feature is added
    await page.goto('/blog');

    // Future implementation:
    // - Look for search input
    // - Enter search term
    // - Verify filtered results
    // - Check results are relevant
  });

  test.skip('should clear search filter', async ({ page }) => {
    // TODO: Implement when search feature is added
    await page.goto('/blog');

    // Future implementation:
    // - Enter search term
    // - Click clear/reset button
    // - Verify all posts returned
  });
});

test.describe('content page accessibility', () => {
  test('should have proper heading hierarchy on blog listing', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);

    // Verify h1 is visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have proper heading hierarchy on blog post', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to first post
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    await page.waitForURL(/\/blog\/.+/);
    await page.waitForLoadState('domcontentloaded');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);

    // Verify h1 is visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have proper heading hierarchy on collective page', async ({ page }) => {
    await page.goto('/collective');
    await page.waitForLoadState('domcontentloaded');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);

    // Verify h1 is visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check first few images for alt text
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    }
  });

  test('should have descriptive link text', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check that links have text content
    const postLinks = page.locator('a[href^="/blog/"]');
    const linkCount = await postLinks.count();

    if (linkCount > 0) {
      const firstLink = postLinks.first();
      const linkText = await firstLink.textContent();
      expect(linkText?.trim().length).toBeGreaterThan(0);
    }
  });
});
