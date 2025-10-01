# BookSalesSection Component - Usage Guide

## Overview

The `BookSalesSection` component is a premium, high-converting sales section for "Turning Snowflakes into Diamonds" by Michael Dugan. It features a sophisticated split layout with the book cover on the left and compelling sales copy on the right, complete with social proof, urgency elements, and clear CTAs.

## Component Features

### Visual Elements
- **Spotlight Effect**: Dynamic spotlight background effect using Aceternity UI
- **Gradient Backgrounds**: Layered gradients for depth and visual interest
- **Animated Grid**: Subtle grid pattern in the background
- **Glowing Book Cover**: Interactive hover effects with glow and scale animations
- **Floating Badges**: Animated testimonial badge and urgency indicator

### Sales Elements
- **Pricing Display**: Large, prominent sale price with strikethrough original price
- **Savings Highlight**: Clear $30 savings indicator with yellow accent
- **Limited Time Badge**: Animated urgency element with pulsing dot
- **Key Benefits**: 5 key takeaways with icons and descriptions
- **Social Proof**: Three testimonials at the bottom
- **Trust Indicators**: Secure checkout, instant access, and guarantee badges

### CTAs (Call to Actions)
- **Primary CTA**: "Buy Now - $47" with HoverBorderGradient effect
- **Secondary CTA**: "Read Free Sample" button
- **TODO Comments**: Integration points for Stripe and PDF preview

## Installation & Usage

### 1. Import the Component

```tsx
import { BookSalesSection } from "@/components/BookSalesSection";
```

### 2. Basic Usage

```tsx
export default function HomePage() {
  return (
    <div>
      <BookSalesSection />
    </div>
  );
}
```

### 3. Integration with Existing Landing Page

Add the component anywhere in your page flow. For example, after the testimonials section:

```tsx
export default function LandingPage() {
  return (
    <main className="bg-black min-h-screen text-white overflow-hidden">
      <Navigation />
      <HeroSection {...heroProps} />
      <ProblemPainPointsGrid {...problemProps} />
      <TestimonialsSection {...testimonialProps} />
      
      {/* Add Book Sales Section */}
      <BookSalesSection />
      
      <LeadMagnetSection {...leadMagnetProps} />
      <Footer />
    </main>
  );
}
```

### 4. Custom Styling (Optional)

Pass a custom className to override or extend styles:

```tsx
<BookSalesSection className="my-custom-class" />
```

## Stripe Integration

The component includes TODO comments marking integration points. Here's how to implement Stripe:

### Setup

1. Install Stripe:
```bash
npm install @stripe/stripe-js
```

2. Add your Stripe publishable key to `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Create a Stripe Price/Product in your Stripe Dashboard for the book ($47)

### Implementation

Update the `handleBuyNow` function in `/src/components/BookSalesSection.tsx`:

```tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const handleBuyNow = async () => {
  try {
    const stripe = await stripePromise;
    
    // Call your API route to create a checkout session
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: 'price_YOUR_STRIPE_PRICE_ID', // Replace with your Stripe Price ID
        quantity: 1,
      }),
    });
    
    const session = await response.json();
    
    // Redirect to Stripe Checkout
    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result?.error) {
      console.error(result.error.message);
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
  }
};
```

### Create Checkout API Route

Create `/src/app/api/checkout/route.ts`:

```tsx
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { priceId, quantity } = await request.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
```

## Free Sample Implementation

Update the `handleFreeSample` function to provide a preview or download:

### Option 1: PDF Preview Modal

```tsx
import { useState } from 'react';

const [showPreview, setShowPreview] = useState(false);

const handleFreeSample = () => {
  setShowPreview(true);
};

// Add modal component
{showPreview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="relative max-w-4xl w-full h-full p-8">
      <button 
        onClick={() => setShowPreview(false)}
        className="absolute top-4 right-4 text-white"
      >
        Close
      </button>
      <iframe 
        src="/sample/turning-snowflakes-sample.pdf" 
        className="w-full h-full rounded-lg"
      />
    </div>
  </div>
)}
```

### Option 2: Direct Download

```tsx
const handleFreeSample = () => {
  const link = document.createElement('a');
  link.href = '/downloads/turning-snowflakes-sample.pdf';
  link.download = 'Turning-Snowflakes-into-Diamonds-Sample.pdf';
  link.click();
};
```

### Option 3: Lead Capture Before Sample

```tsx
const handleFreeSample = () => {
  // Scroll to lead magnet section or open email capture modal
  document.getElementById('lead-magnet')?.scrollIntoView({ 
    behavior: 'smooth' 
  });
};
```

## Customization Options

### Change Pricing

Update the pricing values in the component:

```tsx
<div className="text-5xl md:text-6xl font-light text-primary">
  $47  {/* Change this */}
</div>
<div className="flex flex-col">
  <span className="text-2xl text-gray-500 line-through">$77</span>  {/* And this */}
  <span className="text-sm text-yellow-400 font-medium">Save $30</span>  {/* And this */}
</div>
```

### Update Book Details

Modify the title, subtitle, and author sections:

```tsx
<h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
  Your Book Title  {/* Change this */}
</h2>

<p className="text-xl md:text-2xl text-gray-400 font-light mb-2">
  Your Subtitle  {/* Change this */}
</p>

<p className="text-lg text-gray-500 italic">
  by Author Name  {/* Change this */}
</p>
```

### Add/Remove Benefits

The benefits array can be modified to add or remove items:

```tsx
{[
  {
    icon: "🧬",
    title: "Your Benefit Title",
    description: "Your benefit description"
  },
  // Add more benefits here
].map((benefit, index) => (
  // ... benefit rendering
))}
```

### Modify Testimonials

Update the testimonials array at the bottom:

```tsx
{[
  {
    quote: "Your testimonial quote",
    author: "Author Name",
    role: "Their Role"
  },
  // Add more testimonials
].map((testimonial, index) => (
  // ... testimonial rendering
))}
```

## Responsive Behavior

The component is fully responsive:

- **Mobile (< 640px)**: Single column layout, stacked elements
- **Tablet (640px - 1024px)**: Adjusted spacing, larger touch targets
- **Desktop (> 1024px)**: Full split layout with optimal proportions

## Accessibility Features

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast meets WCAG AA standards

## Performance Considerations

- Uses Next.js `Image` component for optimized image loading
- Framer Motion animations use GPU acceleration
- Lazy loading with `viewport={{ once: true }}` to prevent re-animations
- Minimal re-renders with proper React hooks usage

## Dependencies

Required packages (should already be installed):
- `framer-motion`: Animations
- `next`: Image optimization
- `@/components/ui/hover-border-gradient`: Aceternity UI button
- `@/components/ui/spotlight`: Aceternity UI background effect
- `@/lib/utils`: Utility functions (cn for className merging)

## File Structure

```
src/
├── components/
│   ├── BookSalesSection.tsx        # Main component
│   └── ui/
│       ├── hover-border-gradient.tsx  # Button component
│       └── spotlight.tsx              # Background effect
└── app/
    └── page.tsx                     # Your landing page
```

## Additional Notes

- Ensure `/public/book_cover.jpg` exists and is properly sized
- The component uses the site's existing color scheme (#4fc3f7 primary)
- All animations respect `prefers-reduced-motion` user preferences
- Component is fully typed with TypeScript

## Support

For issues or questions:
- Check that all dependencies are installed
- Verify the book cover image exists at `/public/book_cover.jpg`
- Review console for any TODO implementation reminders
- Ensure Aceternity UI components are properly installed

## Next Steps

1. Add the book cover image to `/public/book_cover.jpg`
2. Implement Stripe integration (see above)
3. Set up the free sample download/preview
4. Customize copy and pricing as needed
5. Test on all device sizes
6. Set up analytics tracking for conversions
