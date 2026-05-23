import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, formatPrice, getFlower } from "@/lib/data";
import { ProductImage } from "@/components/flowers/ProductImage";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "./add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sparkles, Truck, RefreshCw } from "lucide-react";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} · Lirios`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-2xl">
          <ProductImage
            product={product}
            size={520}
            className="aspect-square flex items-center justify-center"
          />
        </div>

        <div className="flex flex-col">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          {product.badges && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <Badge key={b} variant="secondary" className="rounded-full">
                  {b}
                </Badge>
              ))}
            </div>
          )}
          <p className="mt-5 font-display text-3xl tabular-nums">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.composition && product.composition.length > 0 && (
            <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-5">
              <p className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                Composición
              </p>
              <ul className="mt-3 grid gap-2 text-sm">
                {product.composition.map((c) => {
                  const f = getFlower(c.flowerId);
                  if (!f) return null;
                  return (
                    <li
                      key={c.flowerId}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block size-3 rounded-full"
                          style={{ background: f.color }}
                        />
                        {f.name}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        ×{c.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-7">
            <AddToCartButton productId={product.id} />
          </div>

          <Separator className="my-8" />

          <ul className="grid gap-4 text-sm">
            <li className="flex items-start gap-3">
              <Truck className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="font-medium">Envío local mismo día</p>
                <p className="text-muted-foreground">
                  Pide antes de las 14:00 y lo entregamos hoy.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="font-medium">Mensaje a mano incluido</p>
                <p className="text-muted-foreground">
                  Escribimos tu dedicatoria en cartulina de algodón.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <RefreshCw className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="font-medium">Garantía de frescura 7 días</p>
                <p className="text-muted-foreground">
                  Si algo no luce bien, lo reemplazamos.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl tracking-tight">
            También te puede gustar
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
