"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeader } from "@/components/SectionHeader";

const SOLUTION_ITEMS = [
  {
    title: "The Diamond Operating System",
    description:
      "Converts pressure into clarity, chaos into calm. You don't just react better—you lead better. You become the person people trust in crisis.",
    image:
      "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=800&h=400&fit=crop",
    imageAlt: "Meditation and consciousness",
    colSpan: 2,
    delay: 0,
  },
  {
    title: "Swiss Army Knife",
    description:
      "Real-time emotional regulation. Get back to center instantly, no matter what's happening. Body, Breath, Brain tools.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&h=400&fit=crop",
    imageAlt: "Centered presence",
    colSpan: 1,
    delay: 0.1,
  },
  {
    title: "ART & ART² Protocols",
    description:
      "Clears emotional static and reclaims your power. Transform fear, anger, and doubt into intentional action.",
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&h=400&fit=crop",
    imageAlt: "Energy and transformation",
    colSpan: 1,
    delay: 0.2,
  },
  {
    title: "The Diamond Sprint",
    description:
      "30-Day Practice that installs new habits and baseline identity. Build unshakable confidence through consistent action.",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&h=400&fit=crop",
    imageAlt: "Journey and elevation",
    colSpan: 2,
    delay: 0.3,
  },
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          title={
            <>
              Introducing the{" "}
              <span className="text-primary">Diamond Operating System</span>
            </>
          }
          subtitle="A complete transformation system that rewires how you think, feel, and show up under pressure"
        />

        <BentoGrid className="mb-16">
          {SOLUTION_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: item.delay }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <BentoGridItem
                title={item.title}
                description={item.description}
                header={
                  <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 relative">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-cover opacity-60"
                    />
                  </div>
                }
                className={item.colSpan === 2 ? "md:col-span-2" : ""}
              />
            </motion.div>
          ))}
        </BentoGrid>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">
            This isn&apos;t theory. This is{" "}
            <span className="text-primary font-normal">
              embodied transformation
            </span>
            .
          </p>
          <blockquote className="text-lg italic text-gray-400 max-w-3xl mx-auto border-l-2 border-primary pl-6 text-left">
            &quot;Diamonds don&apos;t resist pressure; they&apos;re formed by it.
            They emerge clearer, stronger, and more valuable than before. This is
            about building that response—not in theory, but in the wiring of your
            nervous system.&quot;
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
