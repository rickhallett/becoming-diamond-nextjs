/* eslint-disable react/no-unescaped-entities */
import { DocsPage } from "@/components/docs/docs-page";
import Link from "next/link";

export default function StripeDiscountCodesPage() {
  return (
    <DocsPage
      title="Stripe Discount Codes"
      description="Setup and management of promotional discount codes"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Quick Summary:</strong> Your checkout already supports promotion codes.
          Just create them in Stripe Dashboard - no code changes needed.
        </p>
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Setup time:</strong> 5 minutes
        </p>
        <p className="text-sm text-neutral-400">
          <strong>Research & Documentation Cost:</strong> $40 (1 hour @ $40/hr)
        </p>
      </div>

      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2">Documentation Cost Breakdown</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-1">Stripe promotion codes research</td>
              <td className="text-right py-1">0.5 hours</td>
              <td className="text-right py-1">$20</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-1">Documentation production</td>
              <td className="text-right py-1">0.5 hours</td>
              <td className="text-right py-1">$20</td>
            </tr>
            <tr className="font-semibold">
              <td className="py-1">Total</td>
              <td className="text-right py-1">1 hour</td>
              <td className="text-right py-1">$40</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Current Implementation</h2>
      <p>
        The checkout system has promotion codes enabled via{" "}
        <code className="px-2 py-1 bg-neutral-900 rounded text-sm">
          allow_promotion_codes: true
        </code>{" "}
        in the Stripe Checkout session configuration.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 my-4">
        <p className="text-sm text-neutral-400 mb-2">
          <strong>Code location:</strong>
        </p>
        <code className="text-xs text-neutral-300">
          /src/app/api/stripe/checkout/route.ts:90
        </code>
      </div>

      <h2>How to Create a Discount Code</h2>

      <h3>Step 1: Create a Coupon</h3>
      <p>
        Coupons define the actual discount amount or percentage.
      </p>
      <ol>
        <li>Go to <Link href="https://dashboard.stripe.com" className="text-primary hover:underline" target="_blank">Stripe Dashboard</Link></li>
        <li>Navigate to <strong>Products → Coupons</strong></li>
        <li>Click <strong>Create coupon</strong></li>
        <li>Configure:
          <ul className="ml-6 mt-2">
            <li><strong>Type:</strong> Percentage (20%) or Fixed amount ($10)</li>
            <li><strong>Duration:</strong> Once (one-time purchase) or Forever (subscriptions)</li>
            <li><strong>Name:</strong> Internal reference (e.g., "Holiday 2024 - 20% Off")</li>
          </ul>
        </li>
        <li>Click <strong>Create coupon</strong></li>
      </ol>

      <h3>Step 2: Create a Promotion Code</h3>
      <p>
        Promotion codes are what customers enter during checkout.
      </p>
      <ol>
        <li>Navigate to <strong>Products → Promotion codes</strong></li>
        <li>Click <strong>Create promotion code</strong></li>
        <li>Configure:
          <ul className="ml-6 mt-2">
            <li><strong>Coupon:</strong> Select coupon from Step 1</li>
            <li><strong>Code:</strong> Customer-facing code (e.g., HOLIDAY20)</li>
            <li><strong>Active:</strong> Yes</li>
            <li><strong>Max redemptions:</strong> Optional limit</li>
            <li><strong>Expiration:</strong> Optional end date</li>
          </ul>
        </li>
        <li>Click <strong>Create promotion code</strong></li>
      </ol>

      <h3>Step 3: Test</h3>
      <ol>
        <li>Switch to <strong>Test mode</strong> in Stripe Dashboard</li>
        <li>Create test coupon and promotion code</li>
        <li>Go to checkout on your site</li>
        <li>Enter test card: <code className="px-2 py-1 bg-neutral-900 rounded text-sm">4242 4242 4242 4242</code></li>
        <li>Enter promotion code when prompted</li>
        <li>Verify discount applies correctly</li>
      </ol>

      <h2>Common Discount Strategies</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">New Customers</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Code: <code className="px-2 py-1 bg-neutral-900 rounded text-xs">WELCOME10</code>
          </p>
          <p className="text-sm text-neutral-400">
            10% off for first-time buyers
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Seasonal Sales</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Code: <code className="px-2 py-1 bg-neutral-900 rounded text-xs">HOLIDAY20</code>
          </p>
          <p className="text-sm text-neutral-400">
            20% off limited-time promotion
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">VIP/Referral</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Code: <code className="px-2 py-1 bg-neutral-900 rounded text-xs">VIP50</code>
          </p>
          <p className="text-sm text-neutral-400">
            50% off for special members
          </p>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Flash Sales</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Code: <code className="px-2 py-1 bg-neutral-900 rounded text-xs">FLASH25</code>
          </p>
          <p className="text-sm text-neutral-400">
            25% off with 48-hour expiration
          </p>
        </div>
      </div>

      <h2>Advanced Features</h2>

      <h3>Minimum Purchase Amount</h3>
      <p>
        Require minimum order value for discount (configured in coupon settings).
        Set "Minimum amount" to enforce order threshold.
      </p>

      <h3>First-Time Customer Only</h3>
      <p>
        Restrict codes to new customers by setting "Customer eligibility" to
        "First-time customers". Stripe checks if email has prior purchases.
      </p>

      <h3>Redemption Limits</h3>
      <p>
        Prevent multiple uses by setting "Max redemptions per customer" to 1.
        Each email can only use the code once.
      </p>

      <h2>Management & Tracking</h2>

      <h3>View Performance</h3>
      <p>
        Track redemptions, revenue impact, and customer acquisition in Stripe Dashboard:
      </p>
      <ul>
        <li>Click on any promotion code to view statistics</li>
        <li>See times redeemed and revenue generated</li>
        <li>Monitor discount amounts given</li>
        <li>Track customer acquisition cost</li>
      </ul>

      <h3>Deactivate Codes</h3>
      <p>
        Stop a code from working by clicking <strong>Deactivate</strong> in the
        promotion code details. Code stops working immediately (existing uses unaffected).
      </p>

      <h2>Troubleshooting</h2>

      <h3>Code Not Working</h3>
      <p>Check the following:</p>
      <ul>
        <li>Promotion code is <strong>Active</strong> in dashboard</li>
        <li>Code hasn't reached <strong>Max redemptions</strong></li>
        <li>Code hasn't <strong>Expired</strong></li>
        <li>Customer meets <strong>Eligibility</strong> requirements</li>
        <li>Using correct Test/Live mode keys</li>
      </ul>

      <h3>Promotion Field Not Showing</h3>
      <p>
        Verify <code className="px-2 py-1 bg-neutral-900 rounded text-sm">allow_promotion_codes: true</code> is
        set in the checkout session creation code.
      </p>

      <h2>Resources</h2>

      <div className="space-y-4 my-6">
        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Full Setup Guide</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Comprehensive guide with examples, best practices, and advanced features.
          </p>
          <Link
            href="https://github.com/your-repo/docs/3_guides_and_how-tos/setup/guide-stripe-discount-codes.md"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            View complete guide →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Stripe Documentation</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Official Stripe documentation for promotion codes and coupons.
          </p>
          <Link
            href="https://stripe.com/docs/billing/subscriptions/coupons"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            Stripe docs →
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Stripe Dashboard</h3>
          <p className="text-sm text-neutral-400 mb-2">
            Manage coupons and promotion codes in your Stripe account.
          </p>
          <Link
            href="https://dashboard.stripe.com/coupons"
            className="text-sm text-primary hover:underline"
            target="_blank"
          >
            Open dashboard →
          </Link>
        </div>
      </div>

      <div className="bg-neutral-900 border border-primary/30 rounded-lg p-4 mt-8">
        <p className="text-sm text-neutral-300">
          <strong>Summary:</strong> No code changes needed. Create coupons and
          promotion codes in Stripe Dashboard, test with test mode, then activate
          in live mode. Codes work immediately in checkout.
        </p>
      </div>
    </DocsPage>
  );
}
