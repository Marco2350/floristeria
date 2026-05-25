"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Article } from "@/lib/content";
import { itemVariants } from "@/components/reveal";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/guia/${article.slug}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${article.hero.gradient} transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}
      >
        <div className="flex flex-1 flex-col p-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/60">
            {article.category}
          </p>
          <h3 className="mt-3 font-display text-xl tracking-tight">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-foreground/70">
            {article.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between pt-6 text-xs text-foreground/60">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {article.readingMinutes} min
            </span>
            <ArrowUpRight className="size-4 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
