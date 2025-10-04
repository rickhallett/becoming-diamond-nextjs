/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function DiamondAdvantagePage() {
  return (
    <main className="relative bg-black antialiased">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <div className="inline-block bg-primary/10 border border-primary/30 px-6 py-2 rounded-full mb-6">
              <span className="text-primary text-xl font-bold">$97</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light mb-6"
          >
            Feel Calm, Clear, and <span className="text-primary">Centered</span>—Even in Chaos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Regain control of your emotions and your focus, no matter what life throws at you.
          </motion.p>
        </div>
      </section>

      {/* Core Offer Section */}
      <section id="offer" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={
              <>
                Master the Art of <span className="text-primary">Staying Grounded</span>
              </>
            }
            subtitle="Diamond Advantage"
          />

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl mb-6 font-bold">What You'll Master</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Master one simple practice to stay calm under pressure</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Build daily habits that create unshakable peace</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Reclaim your mental clarity—even in the middle of stress</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8"
            >
              <h3 className="text-2xl mb-6 font-bold">What's Included</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-gray-300">
                  <span className="text-primary mr-2">✓</span>
                  <span>30-day tracker to measure your progress</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <span className="text-primary mr-2">✓</span>
                  <span>Practice prompts to keep you consistent</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <span className="text-primary mr-2">✓</span>
                  <span>Lifetime access to tools that keep you grounded</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative rounded-2xl p-8 bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary">
              <div className="text-center mb-8">
                <h3 className="text-3xl mb-2 font-bold">Diamond Advantage</h3>
                <p className="text-gray-400 mb-4">Perfect for anyone who feels overwhelmed and needs to reset fast.</p>
                <div className="text-5xl font-light mb-6">
                  <span className="text-primary">$97</span>
                </div>
              </div>

              <Link href="/auth/signin">
                <button className="w-full py-4 rounded-lg font-medium transition-all bg-primary text-black hover:bg-primary/90 text-lg">
                  Access the Diamond Advantage
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl mb-4 text-yellow-400 font-bold">14-Day Unshakable Guarantee</h3>
              <p className="text-gray-300 text-base">
                If you don't feel more grounded, clear, and emotionally steady within 2 weeks—we'll refund every penny. <span className="font-bold">No questions asked.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection
        title="Success Stories"
        subtitle="Real transformations from Diamond Advantage members"
        testimonials={[
          {
            quote: "The Diamond Advantage gave me tools that actually work under real pressure. I feel grounded for the first time in years.",
            name: "Jennifer Martinez",
            designation: "Marketing Director",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "After just two weeks, I stopped reacting to every trigger. The 30-day tracker kept me consistent and accountable.",
            name: "Robert Chen",
            designation: "Startup Founder",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "I used to feel overwhelmed constantly. Now I have a simple practice that brings me back to center in seconds.",
            name: "Amanda Williams",
            designation: "Team Lead",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&fit=crop"
          }
        ]}
      />

      {/* CTA to Next Tier */}
      <section className="py-24 px-6 bg-gradient-to-b from-black via-primary/5 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ready for the <span className="text-primary">Next Level</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Step into Diamond Edge Mastery and command respect in any room
            </p>
            <Link href="/offers/diamond-edge-mastery">
              <button className="bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all border border-white/20">
                Explore Diamond Edge Mastery
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
