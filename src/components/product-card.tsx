"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/flowers/ProductImage";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/data";
import { itemVariants } from "@/components/reveal";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/catalogo/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_24px_48px_-24px_rgba(60,40,10,0.18)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <ProductImage
            product={product}
            size={320}
            className="absolute inset-0 flex h-full w-full items-center justify-center transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.badges && product.badges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.badges.map((b) => (
                <Badge
                  key={b}
                  variant="secondary"
                  className="rounded-full bg-background/90 px-2.5 backdrop-blur"
                >
                  {b}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1.5 font-display text-xl tracking-tight">
              {product.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
              {product.shortDescription}
            </p>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-lg tabular-nums">
              {formatPrice(product.price)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-all duration-300 group-hover:gap-1.5 group-hover:text-primary">
              Ver detalle
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
