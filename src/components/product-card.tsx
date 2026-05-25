"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/flowers/ProductImage";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/data";
import { itemVariants } from "@/components/reveal";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div variants={itemVariants} className="group">
      <Link
        href={`/catalogo/${product.slug}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <ProductImage
            product={product}
            size={320}
            className="absolute inset-0 flex h-full w-full items-center justify-center transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
          {/* warm bottom wash on hover */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(to top, oklch(0.22 0.025 65 / 0.18), transparent)",
            }}
          />
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
          <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <WishlistButton productId={product.id} productName={product.name} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1.5">
          <h3 className="font-display text-xl leading-tight tracking-tight">
            {product.name}
          </h3>
          <span
            className="font-display text-lg italic tabular-nums"
            style={{ color: "var(--ochre-deep)" }}
          >
            {formatPrice(product.price)}
          </span>
          <p className="col-span-2 line-clamp-2 text-sm text-[var(--ink-soft)]">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
          <span>{product.category}</span>
          <span className="inline-flex items-center gap-1 transition-all group-hover:gap-1.5 group-hover:text-[var(--ink-deep)]">
            Ver
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
