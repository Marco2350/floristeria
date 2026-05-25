"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function WishlistClient() {
  const ids = useWishlist((s) => s.productIds);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = mounted ? products.filter((p) => ids.includes(p.id)) : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="flex flex-col items-start gap-4">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Tus favoritos
        </p>
        <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
          Lo que te gustaría regalar.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Te lo guardamos para que vuelvas cuando estés listo. Tus favoritos se
          guardan en este navegador.
        </p>
      </div>

      {mounted && items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 py-20 text-center"
        >
          <div
            className="flex size-20 items-center justify-center rounded-full"
            style={{ background: "var(--secondary)" }}
          >
            <Heart className="size-9 text-primary" strokeWidth={1.4} />
          </div>
          <h2 className="font-display text-2xl">Tu lista está vacía.</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tantea el catálogo o personaliza un ramo. El corazón en cada flor
            la guarda aquí.
          </p>
          <div className="mt-2 flex gap-2">
            <Link
              href="/catalogo"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
            >
              Ver catálogo
            </Link>
            <Link
              href="/personalizar"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-full",
              )}
            >
              Personalizar
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="mt-4 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "artículo guardado" : "artículos guardados"}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button
              onClick={clear}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Vaciar la lista
            </button>
          </div>
        </>
      )}
    </div>
  );
}
