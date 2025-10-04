/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function PressureRoomOnePage() {
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
              <span className="text-primary text-xl font-bold">$1,997</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light mb-6"
          >
            Step Into the Fire. Walk Out <span className="text-primary">Unshakable</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Transform how you handle stress and pressure—forever.
          </motion.p>
        </div>
      </section>

      {/* Core Offer Section */}
      <section id="offer" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={
              <>
                The <span className="text-primary">Pressure Room One</span> Experience
              </>
            }
            subtitle="3-Day Immersive Transformation"
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
                  <p className="text-base">Everything in Diamond Edge Mastery</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Full access to the 3-day Pressure Room One experience</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Train under real-world tension and rewire your nervous system</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Master control over your emotions in any situation</p>
                </div>
                <div className="flex items-start">
                  <span className="text-primary mr-3 text-xl">→</span>
                  <p className="text-base">Step into your new presence—strong, clear, undeniable</p>
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
              <h3 className="text-2xl mb-6 font-bold">This Is Different</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Pressure Room One isn't a seminar. It's not a workshop. It's an <span className="text-primary font-semibold">immersive experience</span> designed to test you, break you open, and rebuild you stronger.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                For 3 days, you'll train under real-world tension. You'll face the parts of yourself you've been avoiding. You'll rewire your nervous system at the deepest level.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-primary font-semibold">This is where transformation stops being theoretical and becomes visceral.</span>
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
              <div className="text-center mb-8">
                <h3 className="text-3xl mb-2 font-bold">Pressure Room One</h3>
                <p className="text-gray-400 mb-4">Perfect for those ready to experience the shift—not just think about it.</p>
                <div className="text-5xl font-light mb-6">
                  <span className="text-primary">$1,997</span>
                </div>
              </div>

              <Link href="/auth/signin">
                <button className="w-full py-4 rounded-lg font-medium transition-all bg-primary text-black hover:bg-primary/90 text-lg">
                  Enter Pressure Room One
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
              <h3 className="text-2xl mb-4 text-yellow-400 font-bold">Transformation Guarantee</h3>
              <p className="text-gray-300 text-base">
                Complete the 3-day Pressure Room One experience. If you don't feel fundamentally different in how you handle pressure, we'll refund your investment. <span className="font-bold">We stand behind the work.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Happens Inside */}
      <section className="py-24 px-6 bg-gradient-to-b from-black via-primary/5 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">What Happens <span className="text-primary">Inside</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A 3-day journey designed to rewire how you respond to pressure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                day: "Day 1",
                title: "Stabilize",
                description: "Build nervous system mastery. Learn to regulate your internal state under real-world pressure.",
                focus: "Foundation & Presence"
              },
              {
                day: "Day 2",
                title: "Test",
                description: "Face high-pressure scenarios. Discover where you collapse and why. Train through it.",
                focus: "Breaking Patterns"
              },
              {
                day: "Day 3",
                title: "Integrate",
                description: "Lock in your new operating system. Walk out with a presence that doesn't waver under stress.",
                focus: "Permanent Shift"
              }
            ].map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="text-primary text-sm font-bold mb-2">{day.day}</div>
                <h3 className="text-2xl mb-4 font-bold">{day.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{day.description}</p>
                <div className="text-sm text-gray-400 italic">{day.focus}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection
        title="Success Stories"
        subtitle="Real transformations from Pressure Room One graduates"
        testimonials={[
          {
            quote: "Pressure Room One was the most intense experience of my life—and the most valuable. I walked out fundamentally different.",
            name: "Marcus Johnson",
            designation: "CEO",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "I used to freeze under pressure. After 3 days in the Pressure Room, I now thrive in chaos. My team has noticed.",
            name: "Emily Rodriguez",
            designation: "Director of Strategy",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "This isn't theory. You're tested, broken open, and rebuilt. The nervous system rewiring is real and permanent.",
            name: "David Kim",
            designation: "Founder",
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
              Ready for <span className="text-primary">Total Transformation</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join DiamondMind Immersion and live unshakable every single day
            </p>
            <Link href="/collective">
              <button className="bg-white/10 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all border border-white/20">
                Explore DiamondMind Immersion
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
