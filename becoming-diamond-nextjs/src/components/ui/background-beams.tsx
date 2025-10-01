// @ts-nocheck
"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!beamsRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!beamsRef.current) return;
      const rect = beamsRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      beamsRef.current.style.setProperty("--mouse-x", `${x}px`);
      beamsRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition-all duration-300",
        className,
      )}
    >
      <div className="relative h-full w-full">
        <Beam className="absolute top-[10%] left-[20%]" delay={0} />
        <Beam className="absolute top-[30%] right-[15%]" delay={0.3} />
        <Beam className="absolute bottom-[25%] left-[35%]" delay={0.5} />
        <Beam className="absolute top-[45%] right-[40%]" delay={0.8} />
        <Beam className="absolute bottom-[40%] right-[25%]" delay={1} />
      </div>
    </div>
  );
};

const Beam = ({ className, delay }: { className?: string; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.2] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: delay || 0,
        ease: "easeInOut",
      }}
      className={cn(
        "h-[200px] w-[200px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl",
        className,
      )}
    />
  );
};
