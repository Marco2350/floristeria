"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Clock, Heart, MapPin, Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, cartItemCount } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { SearchDialog } from "@/components/search-dialog";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/personalizar", label: "Personalizar" },
  { href: "/ocasiones", label: "Ocasiones" },
  { href: "/suscripcion", label: "Suscripción" },
  { href: "/guia", label: "Guía" },
  { href: "/faq", label: "FAQ" },
  { href: "/sobre", label: "Historia" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const wishlistIds = useWishlist((s) => s.productIds);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = cartItemCount(items);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcut: cmd/ctrl+K opens search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        aria-hidden={scrolled}
        className={cn(
          "relative z-30 overflow-hidden transition-[max-height,opacity] duration-500",
          scrolled
            ? "max-h-0 opacity-0"
            : "max-h-10 opacity-100",
        )}
        style={{
          background: "var(--ink-deep)",
          color: "var(--paper)",
        }}
      >
        <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-6 px-4 text-[11px] tracking-wide sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <MapPin className="size-3 opacity-70" />
              {BUSINESS.address.short}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3 opacity-70" />
              {BUSINESS.hours.summary}
            </span>
          </div>
          <a
            href={`tel:${BUSINESS.phone.tel}`}
            className="inline-flex items-center gap-1.5 transition hover:text-[oklch(0.78_0.13_75)]"
          >
            <Phone className="size-3 opacity-70" />
            {BUSINESS.phone.display}
          </a>
        </div>
      </div>
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

          <nav className="hidden items-center gap-4 lg:flex lg:gap-5 xl:gap-7">
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
              onClick={() => setSearchOpen(true)}
              className="size-10 rounded-full"
              aria-label="Buscar"
            >
              <Search className="size-5" />
            </Button>
            <Link
              href="/wishlist"
              className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Favoritos"
            >
              <Heart className="size-5" strokeWidth={1.8} />
              {mounted && wishlistIds.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
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
              className="size-10 rounded-full lg:hidden"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Abrir menú"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-border/60 transition-[max-height,opacity] duration-300 lg:hidden",
            mobileOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
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
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
