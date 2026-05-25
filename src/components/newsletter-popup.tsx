"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

const KEY = "lirios-newsletter-popup-seen";
const DELAY_MS = 30000; // 30s after first visit

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl">
            <div
              className="absolute inset-0 -z-10 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at top right, oklch(0.92 0.05 75 / 0.6), transparent 60%)",
              }}
            />
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
            <div className="p-6 pr-10">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
                Newsletter
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight">
                10% off en tu primer pedido.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Suscríbete y te mandamos el código + una nota cada lunes con lo
                que llegó fresco esa semana.
              </p>
              <div className="mt-4">
                <NewsletterForm source="popup" variant="stacked" />
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Sin spam. Cancela cuando quieras.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
