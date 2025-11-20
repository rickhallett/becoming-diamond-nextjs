"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { GLOBE_CONFIG, SAMPLE_ARCS } from "@/config/landing-page";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export function GlobalCommunitySection() {
  return (
    <section className="w-full py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            A GLOBAL COMMUNITY
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Join thousands of individuals worldwide who are transforming their
            lives through the Diamond methodology.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full"
        >
          <World data={SAMPLE_ARCS} globeConfig={GLOBE_CONFIG} />
        </motion.div>
      </div>
    </section>
  );
}
