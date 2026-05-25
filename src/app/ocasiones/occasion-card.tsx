"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Occasion } from "@/lib/occasions";
import { LogoPlaceholder } from "@/components/flowers/logo-placeholder";
import { itemVariants } from "@/components/reveal";

export function OccasionCard({ occasion }: { occasion: Occasion }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/ocasiones/${occasion.slug}`}
        className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${occasion.hero.gradient} p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, oklch(1 0 0 / 0.45), transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <p className="font-display text-sm uppercase tracking-[0.25em] opacity-70">
            Ocasión
          </p>
          <h3 className="mt-2 font-display text-3xl tracking-tight">
            {occasion.name}
          </h3>
          <p className="mt-2 text-sm italic">{occasion.tagline}</p>
        </div>
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div className="opacity-70">
            <LogoPlaceholder
              size={120}
              background="transparent"
              className="flex size-28 items-center justify-center"
            />
          </div>
          <span className="inline-flex items-center gap-1 text-sm transition-all group-hover:gap-1.5">
            Ver
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
