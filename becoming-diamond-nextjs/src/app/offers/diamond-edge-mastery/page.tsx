/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function DiamondEdgeMasteryPage() {
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
              <span className="text-primary text-xl font-bold">$497</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light mb-6"
          >
            Own the Room. Command Respect. Rise with <span className="text-primary">Confidence</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Step into your power and become magnetic in any situation.
          </motion.p>
        </div>
      </section>

      {/* Core Offer Section */}
      <section id="offer" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={
              <>
                Build <span className="text-primary">Magnetic Presence</span>
              </>
            }
            subtitle="Diamond Edge Mastery"
          />

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl mb-6 font-bold">What You'll Experience</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Everything in Diamond Advantage</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">2 live experiential sessions to integrate your new skills</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">1 immersive 5-hour Diamond Seminar for a deep, lasting shift</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Access to a private community of high-achievers</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Ongoing exercises to keep you sharp and growing</p>
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
              <h3 className="text-2xl mb-6 font-bold">The Transformation</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                This isn't just about learning techniques—it's about <span className="text-primary font-semibold">becoming someone new</span>.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through live sessions and deep seminar work, you'll rewire how you show up under pressure. You'll walk into rooms differently. People will notice. You'll feel it.
              </p>
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
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl mb-2 font-bold">Diamond Edge Mastery</h3>
                <p className="text-gray-400 mb-4">Perfect for those ready to feel strong, clear, and unstoppable in real time.</p>
                <div className="text-5xl font-light mb-6">
                  <span className="text-primary">$497</span>
                </div>
              </div>

              <Link href="/auth/signin">
                <button className="w-full py-4 rounded-lg font-medium transition-all bg-primary text-black hover:bg-primary/90 text-lg">
                  Step Into Diamond Edge Mastery
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
        subtitle="Real transformations from Diamond Edge Mastery members"
        testimonials={[
          {
            quote: "The live sessions were game-changing. I walked into my next board meeting with a presence I've never had before. People noticed.",
            name: "Michael Thompson",
            designation: "VP of Operations",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "The 5-hour seminar was intense but profound. I integrated skills I'd been trying to learn for years. This is real transformation.",
            name: "Sarah Chen",
            designation: "Tech Executive",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "The private community is invaluable. Being surrounded by other high-achievers keeps me sharp and accountable.",
            name: "David Martinez",
            designation: "Entrepreneur",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop"
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
              Ready for the <span className="text-primary">Ultimate Test</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Enter Pressure Room One and transform how you handle stress—forever
            </p>
            <Link href="/offers/pressure-room-one">
              <button className="bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all border border-white/20">
                Explore Pressure Room One
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
