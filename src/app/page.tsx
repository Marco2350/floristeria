import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoPlaceholder } from "@/components/flowers/logo-placeholder";
import { ProductCard } from "@/components/product-card";
import { products, categoryMeta } from "@/lib/data";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, StaggerChildren } from "@/components/reveal";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";
import { InstagramGrid } from "@/components/instagram-grid";
import { BUSINESS } from "@/lib/business";


export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const cats = ["ramos", "arreglos", "plantas", "regalos"] as const;

  return (
    <div className="overflow-hidden">
      {/* ──────────────── HERO — editorial split, type with tension ──────────────── */}
      <section className="relative overflow-hidden">
        {/* Single warm ambient halo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-x-0 top-0 h-full"
            style={{
              background:
                "radial-gradient(ellipse 75% 70% at 70% 30%, oklch(0.94 0.06 73 / 0.55) 0%, transparent 70%)",
            }}
          />
          <div className="paper absolute inset-0 opacity-40" />
        </div>

        {/* Masthead */}
        <div
          className="relative mx-auto w-full max-w-7xl border-b px-4 sm:px-6 lg:px-12"
          style={{ borderColor: "oklch(0.55 0.12 73 / 0.18)" }}
        >
          <div className="flex items-center justify-between gap-4 py-4 text-[10px] uppercase tracking-[0.35em] text-[var(--ink-soft)]">
            <span className="font-display italic normal-case tracking-normal text-[13px] text-[var(--ochre-deep)]">
              Lirios
            </span>
            <span className="hidden sm:inline">
              {BUSINESS.city} · {BUSINESS.country}
            </span>
            <span>Vol. 01 / MMXXVI</span>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-8 gap-y-14 px-4 pb-24 pt-16 sm:px-6 md:pb-28 md:pt-24 lg:px-12">
          {/* LEFT — info, with deliberate vertical rhythm */}
          <div className="col-span-12 lg:col-span-7">
            <Reveal delay={0.05}>
              <span className="kicker inline-flex items-center gap-3">
                <span
                  aria-hidden
                  className="hairline w-10"
                  style={{ color: "var(--ochre-deep)" }}
                />
                Florería de temporada · {BUSINESS.city}
              </span>
            </Reveal>

            {/* Headline. "Elegidas" deliberately oversized + italic, breaks into the gutter on lg+ */}
            <Reveal delay={0.18}>
              <h1 className="mt-8 text-balance font-display leading-[0.92] tracking-[-0.03em]">
                <span
                  className="block"
                  style={{
                    fontSize: "clamp(2.8rem, 7.5vw, 6rem)",
                  }}
                >
                  Flores con nombre,
                </span>
                <span
                  className="mt-1 block italic"
                  style={{
                    fontSize: "clamp(3.6rem, 12vw, 10rem)",
                    color: "var(--ochre-deep)",
                    letterSpacing: "-0.045em",
                    lineHeight: "0.88",
                  }}
                >
                  elegidas
                </span>
                <span
                  className="mt-1 block"
                  style={{
                    fontSize: "clamp(2.5rem, 6.5vw, 5.25rem)",
                  }}
                >
                  a mano.
                </span>
              </h1>
            </Reveal>

            {/* Editor's italic side note */}
            <Reveal delay={0.32}>
              <p
                className="mt-8 max-w-md font-display text-base italic leading-relaxed text-[var(--ink-soft)] sm:text-lg"
              >
                Esta semana — peonías, ranúnculos y media docena de rosas
                blancas recién cortadas.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/personalizar"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-full px-7 text-base shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                  )}
                >
                  Diseña tu ramo
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <Link
                  href="/catalogo"
                  className="group inline-flex items-center gap-2 text-base text-[var(--ink-deep)]"
                >
                  <span className="border-b border-current/40 pb-0.5 transition group-hover:border-current">
                    Ver catálogo
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — clean logo plate */}
          <Reveal delay={0.25} className="col-span-12 lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              {/* layered paper stack — secondary shadow card */}
              <div
                aria-hidden
                className="absolute inset-0 translate-x-2 translate-y-3 rounded-[28px]"
                style={{
                  background: "oklch(0.55 0.12 73 / 0.08)",
                }}
              />
              {/* main card */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[28px] border"
                style={{
                  borderColor: "oklch(0.55 0.12 73 / 0.2)",
                  background:
                    "linear-gradient(160deg, oklch(0.98 0.018 80) 0%, oklch(0.93 0.045 75) 100%)",
                  boxShadow:
                    "0 30px 60px -30px oklch(0.4 0.06 65 / 0.3), 0 2px 4px oklch(0.4 0.06 65 / 0.05)",
                }}
              />
              <div className="paper pointer-events-none absolute inset-0 rounded-[28px] opacity-50" />
              {/* large soft halo behind logo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="size-[80%] rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.66 0.14 73 / 0.32) 0%, transparent 60%)",
                  }}
                />
              </div>
              {/* the logo */}
              <div className="absolute inset-x-0 top-0 flex h-[68%] items-center justify-center px-10 pt-6">
                <Image
                  src="/lirios-logo.png"
                  alt="Lirios — Floristería"
                  width={420}
                  height={420}
                  priority
                  className="h-auto w-full max-w-[78%] select-none object-contain drop-shadow-[0_4px_28px_oklch(0.55_0.12_73/0.22)]"
                />
              </div>
              {/* editorial sign-off at base of card */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-8 pb-7 text-center">
                <span
                  aria-hidden
                  className="hairline w-10"
                  style={{ color: "var(--ochre-deep)" }}
                />
                <p
                  className="font-display italic text-[15px] leading-snug text-[var(--ink-deep)]"
                >
                  Edición n.º 01
                  <br />
                  <span className="text-[var(--ink-soft)]">
                    Temporada 2026 · Hecho a mano en Honduras
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom info-band — single confident statement */}
        <div
          className="relative border-y"
          style={{
            borderColor: "var(--border)",
            background: "var(--paper-warm)",
          }}
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-4 px-4 py-5 sm:px-6 lg:px-12">
            <span
              aria-hidden
              className="hairline w-10 sm:w-16"
              style={{ color: "var(--ochre-deep)" }}
            />
            <span className="text-center text-[12px] uppercase tracking-[0.32em] text-[var(--ink-soft)] sm:text-[13px]">
              Cortadas la misma mañana ·{" "}
              <span className="font-display italic normal-case tracking-normal text-[var(--ink-deep)]">
                envíos en El Progreso y zona
              </span>{" "}
              · Pedidos desde 14:00 del día anterior
            </span>
            <span
              aria-hidden
              className="hairline w-10 sm:w-16"
              style={{ color: "var(--ochre-deep)" }}
            />
          </div>
        </div>
      </section>

      {/* ──────────────── CATEGORIES (clean two-row asymmetry) ──────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-12">
        <div className="grid grid-cols-12 items-end gap-6">
          <Reveal className="col-span-12 md:col-span-7">
            <h2 className="display-lg text-balance">
              Cuatro maneras
              <br />
              de{" "}
              <span
                className="italic"
                style={{ color: "var(--ochre-deep)" }}
              >
                regalar
              </span>
              .
            </h2>
          </Reveal>
          <Reveal
            delay={0.1}
            className="col-span-12 md:col-span-4 md:col-start-9"
          >
            <p className="text-pretty text-base leading-relaxed text-[var(--ink-soft)]">
              Desde un ramo a medida hasta un detalle dulce. Elige el camino —
              nosotros nos encargamos de que llegue impecable.
            </p>
          </Reveal>
        </div>

        {/* Two rows: 7+5, then 5+7. Same heights per row, no row-span. */}
        <div className="mt-14 grid grid-cols-12 gap-4 md:gap-5">
          {cats.map((cat, i) => {
            const meta = categoryMeta[cat];
            const sample = products.find((p) => p.category === cat);
            const layout = [
              "col-span-12 md:col-span-7",
              "col-span-12 md:col-span-5",
              "col-span-12 md:col-span-5",
              "col-span-12 md:col-span-7",
            ][i];
            return (
              <CategoryTile
                key={cat}
                cat={cat}
                index={i + 1}
                label={meta.label}
                description={meta.description}
                background={sample?.palette.background ?? "var(--muted)"}
                feature={i === 0 || i === 3}
                className={cn(layout, "aspect-[4/5] sm:aspect-[16/10]")}
              />
            );
          })}
        </div>
      </section>

      {/* ──────────────── DRENCHED CTA — PERSONALIZAR ──────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--ochre-deep)", color: "var(--paper)" }}
      >
        <div className="pointer-events-none absolute inset-0 paper opacity-30" />
        {/* huge contained backdrop word */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 hidden translate-y-[12%] select-none font-display italic leading-none md:block"
          style={{
            fontSize: "clamp(12rem, 24vw, 22rem)",
            color: "oklch(1 0 0 / 0.07)",
            letterSpacing: "-0.04em",
          }}
        >
          ramo
        </span>
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-8 px-4 py-24 sm:px-6 md:py-28 lg:px-12">
          <Reveal className="col-span-12 md:col-span-8" y={32}>
            <span
              className="kicker"
              style={{ color: "oklch(1 0 0 / 0.7)" }}
            >
              N.º 02 — Personaliza
            </span>
            <h2 className="display-lg mt-5 text-balance">
              El ramo perfecto
              <br />
              no se busca:{" "}
              <span className="italic">se compone.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed opacity-90">
              Flor por flor, papel, listón y dedicatoria. Te mostramos cómo va
              quedando en tiempo real, antes de armar nada.
            </p>
            <Link
              href="/personalizar"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--paper)] px-7 text-base font-medium text-[var(--ink-deep)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Empezar a diseñar
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal
            className="col-span-12 md:col-span-4 md:flex md:justify-end"
            delay={0.15}
          >
            <div className="relative aspect-square w-full max-w-xs">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, oklch(1 0 0 / 0.18) 0%, transparent 65%)",
                }}
              />
              <LogoPlaceholder
                size={280}
                background="oklch(1 0 0 / 0.08)"
                className="relative flex h-full w-full items-center justify-center rounded-full backdrop-blur-sm"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────── FEATURED — clean grid, numbered headers ──────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-lg max-w-2xl text-balance">
              Lo que más
              <br />
              se va esta{" "}
              <span
                className="italic"
                style={{ color: "var(--ochre-deep)" }}
              >
                semana
              </span>
              .
            </h2>
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink-deep)]"
            >
              Catálogo completo
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <StaggerChildren
          className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </StaggerChildren>
      </section>

      {/* ──────────────── TESTIMONIALS ──────────────── */}
      <TestimonialsMarquee />

      {/* ──────────────── INSTAGRAM ──────────────── */}
      <InstagramGrid />

      {/* ──────────────── HISTORIA / OFICIO ──────────────── */}
      <section
        className="relative"
        style={{ background: "var(--paper-warm)" }}
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 px-4 py-24 sm:px-6 md:py-28 lg:px-12">
          <Reveal className="col-span-12 md:col-span-5">
            <span className="kicker">N.º 03 — Oficio</span>
            <div className="mt-6 flex items-end gap-4">
              <span
                className="font-display italic leading-none"
                style={{
                  fontSize: "clamp(5rem, 12vw, 10rem)",
                  color: "var(--ochre-deep)",
                  letterSpacing: "-0.04em",
                }}
              >
                15
              </span>
              <span className="pb-3 text-sm uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                Años
                <br />
                a mano
              </span>
            </div>
          </Reveal>
          <div className="col-span-12 md:col-span-7">
            <Reveal>
              <h2 className="display-md text-balance">
                Nos levantamos temprano.{" "}
                <span
                  className="italic"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Para que cuando recibas el ramo,
                </span>{" "}
                huela como debe.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-xl space-y-4 text-base leading-relaxed text-[var(--ink-soft)]">
                <p>
                  Empezamos con un puesto pequeño en El Progreso, Yoro.
                  Trabajamos con productores locales que conocemos por nombre.
                  Sin atajos, sin químicos raros, sin máquinas en medio.
                </p>
                <p>
                  Si tu ramo no llega como debe, lo reponemos. Sin discutir.
                  Las flores son un gesto, y un gesto a medias no nos sirve.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/sobre"
                className="mt-8 inline-flex items-center gap-2 text-base text-[var(--ink-deep)]"
              >
                <span className="border-b border-current/40 pb-0.5 hover:border-current">
                  Cómo trabajamos
                </span>
                <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryTile({
  cat,
  index,
  label,
  description,
  background,
  feature,
  className,
}: {
  cat: string;
  index: number;
  label: string;
  description: string;
  background: string;
  feature?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/catalogo?cat=${cat}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-0.5 sm:p-7",
        className,
      )}
      style={{ background }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 80% 15%, oklch(1 0 0 / 0.4), transparent 55%)",
        }}
      />
      <div className="relative flex items-start justify-between">
        <span
          className="font-display text-3xl italic leading-none sm:text-4xl"
          style={{ color: "var(--ochre-deep)" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
          {cat}
        </span>
      </div>
      <div className="relative">
        <h3
          className={cn(
            "font-display leading-[0.95] tracking-tight",
            feature
              ? "text-4xl sm:text-6xl md:text-7xl"
              : "text-3xl sm:text-5xl",
          )}
        >
          {label}
        </h3>
        {feature && (
          <p className="mt-3 max-w-md text-sm text-[var(--ink-soft)]">
            {description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)] transition-all group-hover:gap-1.5 group-hover:text-[var(--ink-deep)]">
          Explorar
          <ArrowUpRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}
