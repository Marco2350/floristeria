"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, cartItemCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/personalizar", label: "Personaliza tu ramo" },
  { href: "/sobre", label: "Historia" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = cartItemCount(items);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 shadow-[0_1px_24px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center"
          aria-label="Lirios — Floristería"
        >
          <Image
            src="/lirios-logo.png"
            alt="Lirios — Floristería"
            width={160}
            height={64}
            priority
            className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03] sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative size-10 rounded-full"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span
                key={count}
                className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                style={{ animation: "bloom 0.4s ease-out" }}
              >
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full md:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 transition-[max-height,opacity] duration-300 md:hidden",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-base text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
