import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { articles, getArticle } from "@/lib/content";
import { ArticleCard } from "../article-card";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: `${a.title} · Lirios`, description: a.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      <header
        className={`relative overflow-hidden bg-gradient-to-br ${article.hero.gradient}`}
      >
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Link
            href="/guia"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Guía
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-foreground/70">
            {article.category}
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 text-base text-foreground/80">{article.excerpt}</p>
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-foreground/60">
            <Clock className="size-3.5" />
            {article.readingMinutes} min de lectura
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="prose-content space-y-7">
            {article.body.map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h2 className="mt-2 font-display text-2xl tracking-tight">
                    {block.heading}
                  </h2>
                )}
                <p className="mt-2 text-lg leading-relaxed text-foreground/85">
                  {block.paragraph}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl tracking-tight">Sigue leyendo</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </article>
  );
}
