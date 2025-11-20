"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconCheck } from "@tabler/icons-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SectionHeader } from "@/components/SectionHeader";

export function ProgramsSection() {
  const scrollToLeadMagnet = () => {
    document
      .getElementById("lead-magnet")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="programs"
      className="py-24 px-6 bg-gradient-to-b from-black via-primary/5 to-black"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={
            <>
              Choose Your{" "}
              <span className="text-primary">Transformation Path</span>
            </>
          }
          subtitle="From self-paced courses to yearlong coaching—find the right fit for your journey"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Diamond Activation Experience Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
          >
            <CardSpotlight
              className="h-full w-full"
              color="rgba(79, 195, 247, 0.15)"
            >
              <div className="relative z-20 h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Diamond Activation Experience
                  </h3>
                  <p className="text-lg text-primary font-light mb-4">
                    A three-tier transformational path to reset your nervous
                    system, rewire your identity, and lead with presence under
                    pressure.
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Complete online transformation program with three tiers:
                    self-paced ($97), full program with coaching ($497), and
                    premium 1-on-1 mentoring $2997.
                  </p>
                </div>

                <div className="mb-8 flex-grow">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
                    What&apos;s Included
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        Full Diamond Operating System Course
                      </span>
                    </li>
                    <li className="flex items-start">
                      <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        Swiss Army Knife Toolkit
                      </span>
                    </li>
                    <li className="flex items-start">
                      <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        Live Coaching & Community (Full/Premium tiers)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link
                    href="/program"
                    className="block w-full text-center bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors border border-white/20 rounded-lg px-6 py-3"
                  >
                    View Program Details
                  </Link>
                </div>
              </div>
            </CardSpotlight>
          </motion.div>

          {/* DiamondMind Collective Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CardSpotlight
              className="h-full w-full border-primary/40"
              color="rgba(79, 195, 247, 0.2)"
            >
              <div className="relative z-20 h-full flex flex-col">
                {/* Premium Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary to-primary/70 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-primary/50 uppercase tracking-wider">
                  Premium
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    DiamondMind Collective
                  </h3>
                  <p className="text-base text-gray-300 leading-relaxed">
                    A yearlong transformational journey through five
                    high-intensity Pressure Rooms—for those ready to stop
                    reacting and start leading from within. Enrollment is capped
                    at 100 per immersive experience.
                  </p>
                </div>

                <div className="mb-8 flex-grow">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
                    What&apos;s Included
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        12-month guided journey
                      </span>
                    </li>
                    <li className="flex items-start">
                      <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        5 transformational Pressure Rooms
                      </span>
                    </li>
                    <li className="flex items-start">
                      <IconCheck className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">
                        DiamondMindAI support
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link
                    href="/collective"
                    className="block w-full text-center bg-primary/10 backdrop-blur-sm hover:bg-primary/20 transition-colors border border-primary/50 rounded-lg px-6 py-3"
                  >
                    Explore the Collective
                  </Link>
                </div>
              </div>
            </CardSpotlight>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm md:text-base italic">
            Not sure which path is right for you?{" "}
            <button
              onClick={scrollToLeadMagnet}
              className="text-primary hover:underline focus:outline-none"
            >
              Start with the free Diamond Sprint
            </button>{" "}
            to experience the foundation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
