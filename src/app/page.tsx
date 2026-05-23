import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BouquetView } from "@/components/flowers/BouquetView";
import { ProductCard } from "@/components/product-card";
import { products, categoryMeta } from "@/lib/data";
import { ArrowRight, Flower2, Leaf, Sparkles, Heart } from "lucide-react";
import { Reveal, StaggerChildren } from "@/components/reveal";
import { HeroBouquet } from "@/components/hero-bouquet";

const heroComposition = [
  { flowerId: "peony-blush", qty: 5 },
  { flowerId: "rose-white", qty: 4 },
  { flowerId: "lavender", qty: 4 },
  { flowerId: "eucalyptus", qty: 5 },
  { flowerId: "babys-breath", qty: 4 },
];

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--secondary)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_left,_oklch(0.85_0.06_130/0.4)_0%,_transparent_55%)] opacity-80" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-12 md:gap-6 md:pt-24 lg:px-8">
          <div className="md:col-span-7 lg:col-span-6 lg:pr-8">
            <Reveal delay={0.05}>
              <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
                Floristería artesanal
              </p>
            </Reveal>
            <Reveal delay={0.15} y={32}>
              <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Flores con nombre,
                <br />
                <span className="italic text-primary">elegidas</span> a mano.
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Arreglos de temporada, ramos a medida y regalos cuidados. Elige
                del catálogo o diseña tu ramo flor por flor — nosotros lo
                componemos el mismo día.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/personalizar"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-full px-6 text-base shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                  )}
                >
                  Diseña tu ramo
                  <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/catalogo"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-12 rounded-full px-6 text-base",
                  )}
                >
                  Ver catálogo
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-6">
                <Stat label="Flores de temporada" value="40+" />
                <Stat label="Pedidos al día" value="120" />
                <Stat label="Años haciendo ramos" value="15" />
              </div>
            </Reveal>
          </div>

          <div className="relative md:col-span-5 lg:col-span-6">
            <HeroBouquet composition={heroComposition} />
          </div>
        </div>
      </section>

      {/* MARQUEE / VALUES */}
      <Reveal>
        <section className="border-y border-border/60 bg-card">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 text-xs uppercase tracking-[0.25em] text-muted-foreground sm:px-6 lg:px-8">
            <span className="flex items-center gap-2">
              <Flower2 className="size-4 text-primary" /> Cortadas el mismo día
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-2">
              <Leaf className="size-4 text-accent" /> Tallos de productores
              locales
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Envío en bici a la
              zona
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-2">
              <Heart className="size-4 text-accent" /> Mensaje a mano gratis
            </span>
          </div>
        </section>
      </Reveal>

      {/* CATEGORIES */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
                Explora
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                ¿Qué buscas hoy?
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
            >
              Ver todo →
            </Link>
          </div>
        </Reveal>

        <StaggerChildren
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          stagger={0.08}
        >
          {(["ramos", "arreglos", "plantas", "regalos"] as const).map((cat) => {
            const meta = categoryMeta[cat];
            const sample = products.find((p) => p.category === cat);
            return (
              <CategoryCard
                key={cat}
                cat={cat}
                label={meta.label}
                description={meta.description}
                background={sample?.palette.background ?? "var(--muted)"}
              />
            );
          })}
        </StaggerChildren>
      </section>

      {/* FEATURED */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
                Selección de la semana
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                Lo que más se va.
              </h2>
            </div>
          </div>
        </Reveal>
        <StaggerChildren
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </StaggerChildren>
      </section>

      {/* PERSONALIZER CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal y={40}>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 md:py-20">
            <div
              className="absolute -right-20 -top-20 size-80 rounded-full opacity-30 blur-xl"
              style={{ background: "var(--accent)" }}
            />
            <div
              className="absolute -bottom-32 -left-10 size-96 rounded-full opacity-20 blur-2xl"
              style={{ background: "var(--secondary)" }}
            />
            <div className="relative grid items-center gap-12 md:grid-cols-2">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.3em] opacity-80">
                  Personaliza tu ramo
                </p>
                <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                  El ramo perfecto no se busca:
                  <br />
                  <span className="italic">se compone.</span>
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed opacity-90">
                  Elige flor por flor, ajusta cantidades, decide el papel y el
                  listón, y escribe una dedicatoria. Te mostramos cómo va
                  quedando en tiempo real.
                </p>
                <Link
                  href="/personalizar"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "mt-8 h-12 rounded-full px-6 text-base shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                  )}
                >
                  Empezar a diseñar
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div style={{ animation: "float 6s ease-in-out infinite" }}>
                  <BouquetView
                    flowers={[
                      { flowerId: "rose-red", qty: 3 },
                      { flowerId: "rose-white", qty: 3 },
                      { flowerId: "babys-breath", qty: 4 },
                      { flowerId: "eucalyptus", qty: 3 },
                    ]}
                    wrapId="wrap-kraft"
                    ribbonId="ribbon-burgundy"
                    size={360}
                    className="drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* STORY */}
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <Reveal>
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
              Nuestra historia
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Quince años haciendo nudos al listón.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Empezamos en un puesto del mercado en 2010. Hoy seguimos
                levantándonos a las 4:30 para ir a escoger las flores antes que
                nadie.
              </p>
              <p>
                No usamos preservantes raros, no compramos a quien no conocemos
                y cada ramo se arma a mano — porque eso se nota cuando alguien
                lo recibe.
              </p>
            </div>
            <Link
              href="/sobre"
              className="mt-4 inline-block text-primary underline-offset-4 hover:underline"
            >
              Conoce al equipo →
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="aspect-[3/4] rounded-2xl"
              style={{ background: "var(--secondary)" }}
            >
              <div className="flex h-full items-center justify-center">
                <BouquetView
                  flowers={[
                    { flowerId: "peony-blush", qty: 5 },
                    { flowerId: "eucalyptus", qty: 3 },
                  ]}
                  showWrap={false}
                  size={220}
                />
              </div>
            </div>
            <div
              className="mt-10 aspect-[3/4] rounded-2xl"
              style={{ background: "oklch(0.9 0.04 130)" }}
            >
              <div className="flex h-full items-center justify-center">
                <BouquetView
                  flowers={[
                    { flowerId: "sunflower", qty: 3 },
                    { flowerId: "eucalyptus", qty: 3 },
                  ]}
                  showWrap={false}
                  size={220}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl tracking-tight">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function CategoryCard({
  cat,
  label,
  description,
  background,
}: {
  cat: string;
  label: string;
  description: string;
  background: string;
}) {
  return (
    <Link
      href={`/catalogo?cat=${cat}`}
      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl border border-border/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
      style={{ background }}
    >
      <div
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, oklch(1 0 0 / 0.5), transparent 50%)",
        }}
      />
      <div>
        <h3 className="font-display text-2xl tracking-tight">{label}</h3>
        <p className="mt-1 text-xs text-foreground/70">{description}</p>
      </div>
      <span className="self-end font-display text-sm transition-all group-hover:translate-x-0.5">
        Explorar →
      </span>
    </Link>
  );
}
