import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal, StaggerChildren } from "@/components/reveal";
import { occasions, getOccasion, getOccasionProducts } from "@/lib/occasions";
import { LogoPlaceholder } from "@/components/flowers/logo-placeholder";
import { OccasionCard } from "../occasion-card";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = getOccasion(slug);
  if (!o) return {};
  return {
    title: `${o.name} · Lirios`,
    description: o.description,
  };
}

export default async function OccasionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const products = getOccasionProducts(occasion);
  const others = occasions.filter((o) => o.slug !== occasion.slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${occasion.hero.gradient}`}
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 lg:px-8">
          <Reveal>
            <p
              className="font-display text-sm uppercase tracking-[0.3em]"
              style={{ color: occasion.hero.accent }}
            >
              Ocasiones · {occasion.name}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {occasion.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/80">
              {occasion.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#productos"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full px-6 text-base",
                )}
              >
                {occasion.cta}
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
              <Link
                href="/personalizar"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full px-6 text-base",
                )}
              >
                <Sparkles className="mr-1.5 size-4" />
                Personalizar
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex justify-center">
              <LogoPlaceholder
                size={420}
                background="oklch(1 0 0 / 0.5)"
                className="flex aspect-square w-full max-w-md items-center justify-center rounded-3xl"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section
        id="productos"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <Reveal>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
            Nuestra selección
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Curada para {occasion.name.toLowerCase()}.
          </h2>
        </Reveal>
        <StaggerChildren
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </StaggerChildren>
      </section>

      {/* Other occasions */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl tracking-tight">
            Otras ocasiones
          </h2>
        </Reveal>
        <StaggerChildren
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {others.map((o) => (
            <OccasionCard key={o.slug} occasion={o} />
          ))}
        </StaggerChildren>
      </section>
    </div>
  );
}
