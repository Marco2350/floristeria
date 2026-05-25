"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const PETAL_COUNT = 14;

// Deterministic pseudo-random so SSR and client match
function seededRand(seed: number) {
  const x = Math.sin(seed * 9173) * 10000;
  return x - Math.floor(x);
}

export function LoadingScreen() {
  // Mounts only on full page loads. Next.js keeps the root layout mounted
  // across client-side <Link> navigations, so this effect won't re-run.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const hide = setTimeout(() => setVisible(false), 2400);
    const unlock = setTimeout(() => {
      document.body.style.overflow = "";
    }, 3200);
    return () => {
      clearTimeout(hide);
      clearTimeout(unlock);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.98 0.014 80) 0%, oklch(0.95 0.018 75) 65%, oklch(0.92 0.024 70) 100%)",
          }}
        >
          {/* Vignette ring */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                "radial-gradient(circle at center, transparent 30%, oklch(0.22 0.025 65 / 0.06) 100%)",
            }}
          />

          {/* Floating petals */}
          {Array.from({ length: PETAL_COUNT }).map((_, i) => {
            const left = Math.round(seededRand(i + 1) * 10000) / 100;
            const delay = Math.round(seededRand(i + 7) * 120) / 100;
            const drift = Math.round((seededRand(i + 11) - 0.5) * 60);
            const size = Math.round(10 + seededRand(i + 13) * 18);
            const rot = Math.round(seededRand(i + 17) * 360);
            const dur = Math.round((3 + seededRand(i + 23)) * 100) / 100;
            const colors = ["#C28A0F", "#5E7257", "#E5A8B5"];
            const fill = colors[i % 3];
            return (
              <motion.svg
                key={i}
                viewBox="0 0 20 20"
                width={size}
                height={size}
                className="absolute"
                style={{ left: `${left}%`, bottom: "-40px" }}
                initial={{ y: 0, x: 0, opacity: 0, rotate: rot }}
                animate={{
                  y: "-110vh",
                  x: drift,
                  opacity: [0, 0.9, 0.9, 0],
                  rotate: rot + 360,
                }}
                transition={{
                  duration: dur,
                  delay,
                  ease: "easeOut",
                  times: [0, 0.15, 0.85, 1],
                }}
              >
                <path
                  d="M10 1 Q4 6 4 10 Q4 14 10 19 Q16 14 16 10 Q16 6 10 1 Z"
                  fill={fill}
                  opacity={0.7}
                />
              </motion.svg>
            );
          })}

          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Halo */}
              <motion.div
                className="absolute inset-0 -z-10"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1.6, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 1.6,
                  delay: 0.4,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 0.4,
                }}
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.66 0.135 73 / 0.35) 0%, transparent 60%)",
                  filter: "blur(20px)",
                }}
              />
              <Image
                src="/lirios-logo.png"
                alt="Lirios — Floristería"
                width={280}
                height={280}
                priority
                className="h-44 w-auto object-contain sm:h-52 md:h-60"
              />
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 120 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative mt-2 h-px overflow-hidden rounded-full bg-foreground/10"
            >
              <motion.span
                className="absolute inset-y-0 left-0 w-1/3 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.66 0.135 73), transparent)",
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "300%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-4 text-[11px] uppercase tracking-[0.4em] text-muted-foreground"
            >
              Floristería artesanal
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
