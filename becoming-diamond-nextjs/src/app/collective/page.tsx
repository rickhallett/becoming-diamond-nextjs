/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LampContainer } from "@/components/ui/lamp";
import { Timeline } from "@/components/ui/timeline";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { EvervaultCard } from "@/components/ui/evervault-card";

export default function CollectivePage() {
  return (
    <main className="relative bg-black antialiased">
      <Navigation />

      {/* Hero - DiamondMind Collective */}
      <section className="py-24 px-6 relative overflow-hidden pt-32">
        <LampContainer>
          {/* Note: Use `animate` for above-fold content - whileInView doesn't trigger for initially-visible elements */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block bg-primary/10 border border-primary/30 px-6 py-2 rounded-full mb-6">
              <span className="text-primary text-xl font-bold">$7,995</span>
            </div>
            <h1 className="mb-6 text-4xl md:text-6xl">
              The <span className="text-primary">DiamondMind</span> Immersion
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              The Ultimate Transformation: Live Unshakable Every Day.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              A yearlong journey to become emotionally grounded, energetically powerful, and irreplaceable.
            </p>
            <p className="text-2xl font-light mb-16">
              Become the Leader Pressure Can't Break
            </p>

            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg text-gray-300 mb-6">
                A yearlong journey featuring <span className="text-primary font-normal">5 x 3-day Pressure Room Intensives</span> (22 hours each) and <span className="text-primary font-normal">5 x 2-hour Integration Labs</span>—designed to train your body, mind, and identity to operate under pressure with grace, clarity, and conviction.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>Everything in Pressure Room One</span>
                </div>
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>5x 3-day Pressure Room Intensives (22 hours each)</span>
                </div>
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>5x 2-hour Integration Labs to refine and practice your skills</span>
                </div>
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>Digital platform access for ongoing learning</span>
                </div>
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>Surround yourself with others becoming their clearest, strongest selves</span>
                </div>
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>Build emotional precision, energetic strength, and inner steadiness</span>
                </div>
                <div className="flex items-start text-base text-gray-300">
                  <span className="text-primary mr-2">→</span>
                  <span>Create a personal legacy plan to reshape your role, relationships, and reality</span>
                </div>
              </div>
              <p className="text-base text-gray-400 italic">
                This is not a course. This is not a seminar.<br />
                This is <span className="text-primary not-italic">soul-tempering, system-level transformation</span>.
              </p>
            </div>
          </motion.div>
        </LampContainer>
      </section>

      {/* The 5 Pressure Rooms */}
      <section className="py-12 px-6 relative bg-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {[
            {
              number: "I",
              name: "Stabilize",
              description: "Nervous system mastery, presence, self-regulation",
              intensity: "20"
            },
            {
              number: "II",
              name: "Shift",
              description: "Identity rewiring, emotional mastery, ego integration",
              intensity: "30"
            },
            {
              number: "III",
              name: "Strengthen",
              description: "Resilience, coherence, energetic stamina",
              intensity: "40"
            },
            {
              number: "IV",
              name: "Shine",
              description: "Embodied leadership, influence, magnetic presence",
              intensity: "50"
            },
            {
              number: "V",
              name: "Synthesize",
              description: "Purpose, legacy, lifelong adaptability",
              intensity: "60"
            }
          ].map((pr, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-b from-primary/${pr.intensity} to-primary/10 rounded-xl p-6 text-center cursor-pointer overflow-hidden transition-all duration-300 border-2 border-primary/20 hover:border-primary`}
              style={{
                boxShadow: '0 0 0px rgba(79,195,247,0.3)',
                transition: 'all 0.3s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px rgba(79,195,247,0.6), 0 0 40px rgba(79,195,247,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0px rgba(79,195,247,0.3)';
              }}
            >
              <div className="relative z-10">
                <div
                  className="text-4xl font-thin text-primary mb-3 transition-all duration-300"
                  style={{
                    textShadow: `0 0 ${8 + index * 4}px rgba(79,195,247,${0.4 + index * 0.15})`
                  }}
                >
                  PR{pr.number}
                </div>
                <h3 className="text-xl mb-3 transition-all duration-300">{pr.name}</h3>
                <p className="text-sm text-gray-400 transition-all duration-300">{pr.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DiamondMindAI */}
      <section className="py-24 px-6 relative bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center max-w-3xl mx-auto"
        >
          <div className="w-full flex justify-center mb-16">
            <div className="relative w-[500px] h-[500px] max-w-full" style={{
              maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)'
            }}>
              <EvervaultCard text="" className="w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full" style={{ width: '400px', height: '400px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                  <span className="relative z-20 text-4xl md:text-5xl font-bold tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ whiteSpace: 'nowrap' }}>
                    Diamond<span className="text-primary">Mind</span>AI
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl">
            <h3 className="text-2xl md:text-3xl mb-3 text-center text-gray-300">
              Questions About DiamondMind Immersion?
            </h3>
            <p className="text-base md:text-lg mb-8 text-center text-gray-400">
              Ask <span className="text-primary">DiamondMindAI</span>, our flagship model
            </p>
            <PlaceholdersAndVanishInput
              placeholders={[
                "What makes DiamondMind Immersion different?",
                "How long is the transformation journey?",
                "What happens in the 5 Pressure Room Intensives?",
                "Is this right for emerging leaders?",
                "What support do I get during the year?",
              ]}
              onChange={() => {}}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Pressure Room Journey Timeline */}
      <section className="py-24 px-6 relative bg-black">
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl md:text-5xl mb-3">Your <span className="text-primary">Transformation</span> Journey</h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Follow the path that transforms pressure into power, one Pressure Room at a time
            </p>
          </motion.div>

          <Timeline
            data={[
              {
                title: "PR I",
                content: (
                  <div>
                    <h4 className="text-2xl font-normal text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px rgba(79,195,247,0.4))' }}>Stabilize</h4>
                    <p className="mb-4 text-sm md:text-base text-gray-300">
                      Your nervous system is the foundation of everything. In Pressure Room I, you learn to regulate
                      your internal state in real-time—no matter what's happening around you.
                    </p>
                    <p className="mb-6 text-sm md:text-base text-gray-300">
                      Master presence, self-regulation, and somatic awareness. Build the ability to stay grounded
                      when pressure hits.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Swiss Army Knife Protocols
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Breath & Body Regulation
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Presence Under Pressure Training
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300 italic">
                        "After PR1, I stopped reacting to every trigger. I finally feel in control of my nervous system."
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                title: "PR II",
                content: (
                  <div>
                    <h4 className="text-2xl font-normal text-primary mb-4" style={{ filter: 'drop-shadow(0 0 12px rgba(79,195,247,0.5))' }}>Shift</h4>
                    <p className="mb-4 text-sm md:text-base text-gray-300">
                      Your identity is the lens through which you see the world. Pressure Room II rewires limiting beliefs
                      and integrates the parts of yourself you've been running from.
                    </p>
                    <p className="mb-6 text-sm md:text-base text-gray-300">
                      Clear emotional static, master the ART protocols, and integrate your shadow. This is where
                      transformation becomes permanent.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Identity Rewiring Techniques
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> ART & ART² Protocols
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Ego Integration Work
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300 italic">
                        "PR2 helped me see patterns I've carried for decades. The identity shift was profound."
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                title: "PR III",
                content: (
                  <div>
                    <h4 className="text-2xl font-normal text-primary mb-4" style={{ filter: 'drop-shadow(0 0 16px rgba(79,195,247,0.6))' }}>Strengthen</h4>
                    <p className="mb-4 text-sm md:text-base text-gray-300">
                      Resilience isn't about enduring stress—it's about recovering quickly. Pressure Room III builds
                      energetic stamina and coherence so you can perform at your peak, sustainably.
                    </p>
                    <p className="mb-6 text-sm md:text-base text-gray-300">
                      Learn to move fluidly between high output and deep rest. Stop crashing after high-pressure weeks.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Energy Management Systems
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Coherence Training
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Recovery Protocols
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300 italic">
                        "I used to crash after high-pressure weeks. Now I recover in hours, not days."
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                title: "PR IV",
                content: (
                  <div>
                    <h4 className="text-2xl font-normal text-primary mb-4" style={{ filter: 'drop-shadow(0 0 20px rgba(79,195,247,0.7))' }}>Shine</h4>
                    <p className="mb-4 text-sm md:text-base text-gray-300">
                      Leadership isn't about authority—it's about presence. Pressure Room IV trains you to embody the
                      kind of magnetic presence that naturally commands rooms and inspires action.
                    </p>
                    <p className="mb-6 text-sm md:text-base text-gray-300">
                      Master influence, communication, and embodied leadership. Become the person people look to in crisis.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Embodied Leadership Training
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Influence & Communication Mastery
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Magnetic Presence Development
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300 italic">
                        "People now look to me for leadership in ways they never did before. PR4 gave me presence."
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                title: "PR V",
                content: (
                  <div>
                    <h4 className="text-2xl font-normal text-primary mb-4" style={{ filter: 'drop-shadow(0 0 24px rgba(79,195,247,0.8))' }}>Synthesize</h4>
                    <p className="mb-4 text-sm md:text-base text-gray-300">
                      Integration is where everything comes together. Pressure Room V helps you synthesize your
                      transformation into a coherent life purpose and legacy.
                    </p>
                    <p className="mb-6 text-sm md:text-base text-gray-300">
                      Design your future with intention. Build lifelong adaptability. Leave a mark that matters.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Purpose Clarification
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Legacy Design
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                        <span className="text-primary">→</span> Lifelong Adaptability Framework
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-300 italic">
                        "PR5 gave me clarity on my life's work. I'm designing my future with intention now."
                      </p>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black via-primary/10 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              Ready to Begin Your <span className="text-primary">Transformation</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Applications are now open for the next cohort of DiamondMind Immersion
            </p>
            <Link href="/auth/signin">
              <button className="bg-primary text-black px-10 py-5 rounded-full text-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                Begin Your DiamondMind Immersion
              </button>
            </Link>
            <p className="text-sm text-gray-500 mt-6">Perfect for those ready to live from the Diamond frequency—every single day.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
