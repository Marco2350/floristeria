"use client";

import { motion } from "motion/react";
import { BouquetView } from "@/components/flowers/BouquetView";

type Composition = { flowerId: string; qty: number }[];

export function HeroBouquet({ composition }: { composition: Composition }) {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      {/* Decorative blurred blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, oklch(0.92 0.04 30 / 0.6) 0%, transparent 60%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute -left-4 top-12 size-20 rounded-full blur-md"
        style={{ background: "oklch(0.82 0.08 130 / 0.4)" }}
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.55, x: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute -right-2 bottom-16 size-28 rounded-full blur-md"
        style={{ background: "oklch(0.85 0.05 25 / 0.5)" }}
      />

      <div className="relative flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BouquetView
              flowers={composition}
              wrapId="wrap-korean"
              ribbonId="ribbon-sage"
              size={460}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
