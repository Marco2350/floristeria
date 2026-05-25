import Link from "next/link";
import type { ReactNode } from "react";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
        Legal
      </p>
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
        Actualizado el {updated}
      </p>

      <nav className="mt-8 flex flex-wrap gap-2 text-sm">
        <Link
          href="/legal/terminos"
          className="rounded-full border border-border/60 bg-card px-3 py-1.5 hover:border-foreground/30"
        >
          Términos
        </Link>
        <Link
          href="/legal/privacidad"
          className="rounded-full border border-border/60 bg-card px-3 py-1.5 hover:border-foreground/30"
        >
          Privacidad
        </Link>
        <Link
          href="/legal/cookies"
          className="rounded-full border border-border/60 bg-card px-3 py-1.5 hover:border-foreground/30"
        >
          Cookies
        </Link>
      </nav>

      <div className="legal mt-10 space-y-5 text-base leading-relaxed text-foreground/85">
        {children}
      </div>
    </div>
  );
}
