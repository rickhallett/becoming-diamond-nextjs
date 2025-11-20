"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { GLOBE_CONFIG, SAMPLE_ARCS } from "@/config/landing-page";
import { SectionHeader } from "@/components/SectionHeader";

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
    <section className="py-24 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto w-full relative">
        <SectionHeader
          title={
            <>
              Join a Diamond Mind <span className="text-primary">Global Movement</span>
            </>
          }
          subtitle="Thousands of leaders, entrepreneurs, and change-makers across six continents are turning pressure into clarity. The movement is growing. Your place is waiting."
        />

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
