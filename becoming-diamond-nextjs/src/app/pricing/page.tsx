'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PricingTier {
  name: string;
  price: string;
  priceId: string;
  interval?: string;
  features: string[];
  recommended?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Diamond Sprint',
    price: '$497',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DIAMOND_SPRINT_TEST || '',
    features: [
      '30-day nervous system training',
      'Lifetime access to course materials',
      'Complete Diamond Manifesto',
      'Daily practice guides',
      'Community support',
      'Progress tracking',
    ],
  },
  {
    name: 'Monthly Membership',
    price: '$97',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_TEST || '',
    interval: 'per month',
    features: [
      'All Sprint Course content',
      'Monthly live coaching calls',
      'Private community access',
      'New content updates',
      'Priority support',
      'Cancel anytime',
    ],
    recommended: true,
  },
  {
    name: 'Annual Membership',
    price: '$970',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL_TEST || '',
    interval: 'per year',
    features: [
      'Everything in Monthly',
      'Save 2 months ($194/year)',
      'Annual retreat discount',
      'Exclusive masterclasses',
      '1-on-1 coaching session',
      'Lifetime community access',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restrict access to local development only
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname.startsWith('192.168.') ||
                        window.location.hostname.endsWith('.local');

    if (!isLocalhost) {
      router.push('/');
    }
  }, [router]);

  const handleCheckout = async (priceId: string, tierName: string) => {
    if (!priceId) {
      setError('Stripe is not configured. Please run: ./scripts/setup-stripe.sh');
      return;
    }

    setLoadingTier(tierName);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing?cancelled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to initiate checkout. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Transform Your Nervous System
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the path that fits your journey to becoming diamond
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border ${
                tier.recommended
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.interval && (
                    <span className="text-gray-400 text-sm">{tier.interval}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(tier.priceId, tier.name)}
                disabled={loadingTier === tier.name}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  tier.recommended
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${
                  loadingTier === tier.name
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {loadingTier === tier.name ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-300">
                We accept all major credit cards, debit cards, and digital wallets through Stripe&apos;s secure checkout.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-300">
                Yes, you can cancel your monthly or annual subscription at any time. You&apos;ll retain access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-300">
                We offer a 30-day money-back guarantee on all purchases. If you&apos;re not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
