/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface BookSalesSectionProps {
  className?: string;
}

/**
 * BookSalesSection Component
 *
 * A premium, high-converting book sales section for "Turning Snowflakes into Diamonds"
 * by Michael Dugan. Features a split layout with book cover on the left and sales copy
 * on the right, complete with social proof, urgency elements, and compelling CTAs.
 *
 * Integrates seamlessly with the Becoming Diamond website's aesthetic:
 * - Black background with #4fc3f7 primary color
 * - Spotlight and gradient effects
 * - Framer Motion animations
 * - Mobile-responsive design
 *
 * @example
 * ```tsx
 * import { BookSalesSection } from "@/components/BookSalesSection";
 *
 * export default function Page() {
 *   return (
 *     <div>
 *       <BookSalesSection />
 *     </div>
 *   );
 * }
 * ```
 */
export function BookSalesSection({ className }: BookSalesSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stripe Checkout Integration (using modern URL-based redirect)
  const handleBuyNow = async () => {
    setIsLoading(true);

    try {
      // Product ID: prod_T9jYQj5hLB9gYw
      // Price ID: price_1SDQ50RVLr5O3VREdsw5inuj

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1SDQ50RVLr5O3VREdsw5inuj",
          productId: "prod_T9jYQj5hLB9gYw",
        }),
      });

      const { url } = await response.json();

      // Redirect to Stripe Checkout using the session URL
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  // TODO: Implement free sample download/preview
  const handleFreeSample = () => {
    console.log("TODO: Implement free sample preview or download");
    // Integration point for PDF preview or download
    // Option 1: Open PDF in new tab
    // window.open('/docs/content/turning-snowflakes-into-diamonds-sample.pdf', '_blank');

    // Option 2: Trigger download
    // const link = document.createElement('a');
    // link.href = '/docs/content/turning-snowflakes-into-diamonds-sample.pdf';
    // link.download = 'turning-snowflakes-into-diamonds-sample.pdf';
    // link.click();

    // Option 3: Show preview modal (requires additional component)
  };

  return (
    <section
      id="book"
      className={cn(
        "relative py-24 px-6 overflow-hidden bg-black",
        className
      )}
    >
      {/* Spotlight Effect */}
      <Spotlight
        className="top-0 left-0 md:left-1/4 md:-top-10"
        fill="#4fc3f7"
      />

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black pointer-events-none" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Limited Time Offer Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
            <span className="text-yellow-300 text-sm font-medium">
              Limited Time: Save $30
            </span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative group">
              {/* Glow Effect Behind Book */}
              <div
                className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full transition-all duration-500 group-hover:bg-primary/30"
                style={{ transform: 'scale(0.8)' }}
              />

              {/* Book Cover Container */}
              <div
                className="relative aspect-[2/3] max-w-md mx-auto transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg" />
                <Image
                  src="/book_cover.jpg"
                  alt="Turning Snowflakes into Diamonds by Michael Dugan"
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  priority
                />

                {/* Animated Border on Hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(90deg, #4fc3f7, transparent, #4fc3f7)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                      padding: '2px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }}
                  />
                )}
              </div>

              {/* Floating Badge - "As Featured In" */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-secondary/90 backdrop-blur-sm border border-primary/30 rounded-xl p-4 shadow-xl"
              >
                <div className="text-xs text-gray-400 mb-1">Readers say:</div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm font-medium text-white">"Life-changing"</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Sales Copy */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Title & Subtitle */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-light mb-4"
              >
                Turning <span className="text-primary">Snowflakes</span>
                <br />
                into Diamonds
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl text-gray-400 font-light mb-2"
              >
                Turn Pressure Into Power in the Age of AI
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-500 italic"
              >
                by Michael Dugan
              </motion.p>
            </div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-baseline gap-4"
            >
              <div className="text-5xl md:text-6xl font-light text-primary">
                $47
              </div>
              <div className="flex flex-col">
                <span className="text-2xl text-gray-500 line-through">$77</span>
                <span className="text-sm text-yellow-400 font-medium">Save $30</span>
              </div>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h3 className="text-xl font-normal text-white mb-4">
                What You'll Discover:
              </h3>

              {[
                {
                  icon: "",
                  title: "The Diamond Operating System",
                  description: "Transform how your nervous system responds to pressure"
                },
                {
                  icon: "",
                  title: "Swiss Army Knife Tools",
                  description: "Body, Breath, and Brain protocols for instant regulation"
                },
                {
                  icon: "",
                  title: "ART & ART² Protocols",
                  description: "Clear emotional blocks and reclaim your power"
                },
                {
                  icon: "",
                  title: "30-Day Diamond Sprint",
                  description: "Install unshakable confidence through daily practice"
                },
                {
                  icon: "",
                  title: "AI-Proof Your Value",
                  description: "Master the one thing machines will never replace: human presence"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                  <div>
                    <div className="text-white font-medium mb-1">{benefit.title}</div>
                    <div className="text-sm text-gray-400">{benefit.description}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="space-y-4 pt-4"
            >
              {/* Primary CTA */}
              <div className={cn(isLoading && "opacity-50 pointer-events-none")}>
                <HoverBorderGradient
                  containerClassName="rounded-full w-full"
                  as="button"
                  className="bg-primary text-black px-8 py-4 text-lg font-medium w-full"
                  onClick={handleBuyNow}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Buy Now - $47
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </HoverBorderGradient>
              </div>

              {/* Secondary CTA */}
              <button
                onClick={handleFreeSample}
                className="w-full border border-primary/50 text-primary px-8 py-4 text-lg font-medium rounded-full hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read Free Sample
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              viewport={{ once: true }}
              className="pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>14-Day Guarantee</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Testimonial Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-white/10"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                quote: "This book gave me the roadmap I needed to thrive under pressure. Worth 10x the price.",
                author: "Sarah M.",
                role: "Tech Executive"
              },
              {
                quote: "Michael's protocols literally rewired my nervous system. I'm not the same person I was.",
                author: "James R.",
                role: "Entrepreneur"
              },
              {
                quote: "The Diamond Operating System is the antidote to AI anxiety. This is essential reading.",
                author: "Lisa K.",
                role: "Leadership Coach"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                <div className="text-sm">
                  <div className="text-white font-medium">{testimonial.author}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
