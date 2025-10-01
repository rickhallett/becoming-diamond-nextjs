/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function ProgramPage() {
  return (
    <main className="relative bg-black antialiased">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-light mb-6"
          >
            The Diamond <span className="text-primary">Activation</span> Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Transform how you think, feel, and show up under pressure
          </motion.p>
        </div>
      </section>

      {/* Core Offer Section */}
      <section id="offers" className="py-24 px-6 bg-gradient-to-b from-black via-secondary/30 to-black relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={
              <>
                You Weren't Made to <span className="text-primary">Survive</span> Pressure.<br />
                You Were Made to <span className="text-primary">Become Something</span> Under It.
              </>
            }
            subtitle="The Diamond Activation Experience"
          />

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl mb-4 font-bold">The Problem</h3>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p className="text-base">You feel <span className="text-primary">stuck</span>—not because you're lazy, but because you've outgrown your current identity.</p>
                <p className="text-base"><span className="text-primary">Your nervous system is dysregulated.</span> Your emotions spike and crash. Your confidence wavers.</p>
                <p className="text-base">And no amount of positive thinking, productivity hacks, or hustle is fixing it.</p>
                <p className="text-base font-normal text-white pt-4">Because the problem isn't your mindset. It's your <span className="text-primary">operating system</span>.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8"
            >
              <h3 className="text-xl mb-4 font-bold">The Solution</h3>
              <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                The Diamond Activation Experience is a complete transformation system that rewires how you think, feel, and show up under pressure.
              </p>
              <div className="space-y-2.5 text-sm text-gray-300">
                <p className="flex items-start text-base">
                  <span className="text-primary mr-2">→</span>
                  How to regulate your nervous system in real-time
                </p>
                <p className="flex items-start text-base">
                  <span className="text-primary mr-2">→</span>
                  How to clear emotional blocks instantly
                </p>
                <p className="flex items-start text-base">
                  <span className="text-primary mr-2">→</span>
                  How to install a new identity that doesn't collapse under stress
                </p>
                <p className="flex items-start text-base">
                  <span className="text-primary mr-2">→</span>
                  How to lead with <span className="text-primary font-bold">&nbsp;magnetic presence</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Pricing Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Recorded Version",
                price: "$97",
                description: "Self-paced transformation",
                features: [
                  "Full Diamond Operating System Course",
                  "Swiss Army Knife Toolkit",
                  "ART & ART² Protocols",
                  "30-Day Diamond Sprint Tracker",
                  "Lifetime Access"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Full Program",
                price: "$497",
                description: "Complete with live coaching",
                features: [
                  "Everything in Recorded Version",
                  "3 Live Coaching Calls with Michael",
                  "Emotional Mastery Mini-Course ($497 value)",
                  "Influence Masterclass ($297 value)",
                  "Private Diamond Forum (Priceless)",
                  "Total Value: $2,488"
                ],
                cta: "Start Your Transformation",
                popular: true
              },
              {
                name: "Premium",
                price: "$3,000",
                description: "Includes 1-on-1 mentoring",
                features: [
                  "Everything in Full Program",
                  "Private 1-on-1 Sessions",
                  "Priority Support",
                  "Custom Action Plan",
                  "Personalized Accountability"
                ],
                cta: "Apply Now",
                popular: false
              }
            ].map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 ${tier.popular
                  ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary'
                  : 'bg-secondary/50 border border-white/10'
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-4">{tier.description}</p>
                <div className="text-4xl font-light mb-6">{tier.price}</div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                      <span className="text-primary mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth">
                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-all ${tier.popular
                      ? 'bg-primary text-black hover:bg-primary/90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                  >
                    {tier.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
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
        subtitle="Real transformations from program graduates"
        testimonials={[
          {
            quote: "The Diamond Activation Experience gave me tools that actually work under real pressure. My entire nervous system feels upgraded.",
            name: "Mark Thompson",
            designation: "Corporate Leader",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "After completing the program, I stopped reacting to every trigger. I finally feel in control of my nervous system and my life.",
            name: "Sarah Chen",
            designation: "Tech VP",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&fit=crop"
          },
          {
            quote: "The identity work was profound. I've cleared patterns I've carried for decades. This isn't just coaching—it's transformation.",
            name: "David Martinez",
            designation: "Founder & CEO",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=600&fit=crop"
          }
        ]}
      />

      {/* CTA to Collective */}
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
              The DiamondMind Collective is a yearlong transformation journey for emerging leaders
            </p>
            <Link href="/collective">
              <button className="bg-primary text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-all">
                Explore the Collective
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
