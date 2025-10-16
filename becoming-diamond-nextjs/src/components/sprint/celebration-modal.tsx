"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { IconSparkles, IconTrophy, IconFlame } from "@tabler/icons-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  streakCount: number;
  onContinue: () => void;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  dayNumber,
  streakCount,
  onContinue,
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Initial confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4fc3f7", "#ffffff", "#ffd700"],
      });

      // Secondary burst after delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#4fc3f7", "#ffffff"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#4fc3f7", "#ffffff"],
        });
      }, 250);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-secondary/95 border border-primary/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {/* Trophy Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                    className="bg-gradient-to-br from-primary/40 to-primary/20 rounded-full p-6"
                  >
                    <IconTrophy className="w-16 h-16 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="absolute -top-2 -right-2"
                  >
                    <IconSparkles className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </div>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <h2 className="text-3xl font-light mb-2">
                  Day <span className="text-primary">{dayNumber}</span> Complete!
                </h2>
                <p className="text-gray-300 text-lg">
                  Another step closer to diamond.
                </p>
              </motion.div>

              {/* Streak Counter */}
              {streakCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-black/50 border border-primary/20 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center justify-center gap-3">
                    <IconFlame className="w-6 h-6 text-orange-400" />
                    <div>
                      <div className="text-2xl font-light text-white">
                        {streakCount} Day{streakCount !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-gray-400">Current Streak</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-medium py-4 rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-primary/20"
              >
                Continue to Next Day
              </motion.button>

              {/* Close Link */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="w-full text-gray-400 text-sm mt-4 hover:text-gray-300 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
