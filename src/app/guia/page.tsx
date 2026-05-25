import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Reveal, StaggerChildren } from "@/components/reveal";
import { articles } from "@/lib/content";
import { ArticleCard } from "./article-card";

export const metadata = {
  title: "Guía de cuidados · Lirios",
  description:
    "Cómo cuidar tus flores, qué flores regalar, calendario de temporadas y más.",
};

export default function GuiaIndexPage() {
  const [hero, ...rest] = articles;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <Reveal>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
          Guía
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
          Lo que aprendimos al armar miles de ramos.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Cuidados, significados, estilo. Lo escribimos aquí para que no
          tengas que preguntar dos veces.
        </p>
      </Reveal>

      {hero && (
        <Reveal>
          <Link
            href={`/guia/${hero.slug}`}
            className={`group relative mt-14 grid overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${hero.hero.gradient} transition-all hover:shadow-2xl md:grid-cols-2`}
          >
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="inline-block w-fit rounded-full bg-background/70 px-3 py-1 text-[11px] uppercase tracking-widest backdrop-blur">
                Lectura destacada
              </p>
              <h2 className="mt-5 font-display text-3xl tracking-tight sm:text-4xl">
                {hero.title}
              </h2>
              <p className="mt-3 text-base text-foreground/80">{hero.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{hero.category}</span>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" />
                  {hero.readingMinutes} min
                </span>
              </div>
            </div>
            <div className="relative hidden items-center justify-center p-8 md:flex">
              <span className="font-display text-[16rem] leading-none opacity-10">
                ❀
              </span>
              <ArrowUpRight className="absolute right-8 top-8 size-6 text-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
          </Link>
        </Reveal>
      )}

      <StaggerChildren
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.08}
      >
        {rest.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </StaggerChildren>
    </div>
  );
}
