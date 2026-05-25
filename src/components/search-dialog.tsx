"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Sparkles, ArrowUpRight } from "lucide-react";
import { products, categoryMeta, formatPrice } from "@/lib/data";
import { ProductImage } from "@/components/flowers/ProductImage";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const QUICK_LINKS = [
  { label: "Personalizar ramo", href: "/personalizar" },
  { label: "Ocasiones", href: "/ocasiones" },
  { label: "Suscripción semanal", href: "/suscripcion" },
  { label: "Guía de cuidados", href: "/guia" },
];

export function SearchDialog({ open, onClose }: Props) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return products
      .filter((p) => {
        const hay = `${p.name} ${p.shortDescription} ${p.description} ${categoryMeta[p.category].label}`.toLowerCase();
        return hay.includes(query);
      })
      .slice(0, 6);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Cerrar búsqueda"
          />
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
              <Search className="size-5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca rosas, peonías, regalos, ocasiones…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded border border-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground sm:inline-block">
                ESC
              </kbd>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {q.trim().length === 0 ? (
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Sugerencias
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {QUICK_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-sm transition hover:border-primary/40 hover:text-primary"
                      >
                        <Sparkles className="size-3.5 text-primary" />
                        {l.label}
                      </Link>
                    ))}
                  </div>

                  <p className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground">
                    Categorías
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["ramos", "arreglos", "plantas", "regalos"] as const).map((cat) => (
                      <Link
                        key={cat}
                        href={`/catalogo?cat=${cat}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm transition hover:border-primary/40 hover:bg-muted/50"
                      >
                        {categoryMeta[cat].label}
                        <ArrowUpRight className="size-3.5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="font-display text-xl">Nada por aquí 🌱</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No encontramos algo con "{q}". Prueba con "rosa", "peonía" o
                    "regalo".
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/catalogo/${p.slug}`}
                        onClick={onClose}
                        className="group flex items-center gap-4 rounded-lg px-3 py-3 transition hover:bg-muted/40"
                      >
                        <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                          <ProductImage product={p} size={56} className="h-full w-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">
                            <HighlightedText text={p.name} query={q} />
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {categoryMeta[p.category].label} · {p.shortDescription}
                          </p>
                        </div>
                        <span className="shrink-0 font-display text-sm tabular-nums">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        className={cn(
          "rounded bg-primary/15 px-0.5 text-foreground",
          "decoration-primary",
        )}
      >
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}
